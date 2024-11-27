import { polygon, mainnet, bsc, type Chain } from "viem/chains";
import { BigNumberish, HexAddress } from "@/types";
import {
  createPublicClient,
  decodeFunctionData,
  http,
  parseAbi,
  parseUnits,
} from "viem";
import { sendMail } from "@/lib/mailer";

export const getGaraEstimate = (
  token: string,
  amount: number,
  tokenValue?: number
) => {
  if (!token || !amount) return 0;

  if (token === "USDC" || token === "USDT") {
    return usdcToGara(amount);
  }

  if (!tokenValue) return 0;
  return amount * tokenValue;
};

export const usdcToGara = (usdc: number) => usdc / 0.1; // 1 USDC = 0.1 GARA

export const getChainByName = (chain: string): Chain => {
  switch (chain) {
    case "Polygon":
      return polygon;
    case "Ethereum":
      return mainnet;
    case "BNB Smart Chain":
      return bsc;
    default:
      return polygon;
  }
};

// The ABI of the ERC-20 contract (relevant parts for the `transfer` function)
const erc20Abi = [
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
];

const handleOpsAbi = parseAbi([
  "function handleOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],address)",
]);

export function validateTransactionHash(txHash: string) {
  return /^(0x)?[0-9a-fA-F]{64}$/.test(txHash);
}

function toLowerCase(address: string) {
  if (!address || typeof address !== "string") return "";
  return address.toLowerCase();
}

export const ethereumRpcUrl =
  process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL ||
  "https://ethereum-rpc.publicnode.com";
export const polygonRpcUrl =
  process.env.NEXT_PUBLIC_POLYGON_RPC_URL ||
  "https://polygon-bor-rpc.publicnode.com";
export const bscRpcUrl =
  process.env.NEXT_PUBLIC_BSC_RPC_URL || "https://bsc-rpc.publicnode.com";

export const getRpcNode = (chain: string) => {
  switch (chain) {
    case "Ethereum":
      return http(ethereumRpcUrl);
    case "Polygon":
      return http(polygonRpcUrl);
    case "BNB Smart Chain":
      return http(bscRpcUrl);
    default:
      return http();
  }
};
// Helper function for retrying with a delay
const retryWithDelay = async (
  fn: () => Promise<any>,
  retries: number,
  delay: number
) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < retries - 1) {
        console.log(
          `Retry ${i + 1}/${retries} failed, retrying in ${
            delay / 1000
          } seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error; // If all retries fail, throw the error
      }
    }
  }
};

export async function validateTransaction({
  chain,
  txHash,
  from,
  to,
  amount,
}: {
  chain: string;
  txHash: HexAddress;
  from: HexAddress;
  to: HexAddress;
  amount: string;
}) {
  try {
    if (!validateTransactionHash(txHash)) {
      throw new Error("Invalid transaction hash");
    }
    const _chain = getChainByName(chain);
    const transport = getRpcNode(chain);
    const publicClient = createPublicClient({
      chain: _chain,
      transport: transport,
    });

    // Retry mechanism for getTransactionReceipt with a 5-second delay and 3 retries
    const receipt = await retryWithDelay(
      () => publicClient.getTransactionReceipt({ hash: txHash }),
      3,
      5000
    );

    const transaction = await publicClient.getTransaction({ hash: txHash });

    let decoded;
    let functionTo = "" as HexAddress;
    let functionFrom = "" as HexAddress;
    let functionValue = "" as BigNumberish;
    try {
      decoded = decodeFunctionData({
        abi: erc20Abi,
        data: transaction.input,
      });
      functionTo = (decoded?.args?.[0] || "") as HexAddress;
      functionFrom = transaction.from;
      functionValue = (decoded?.args?.[1] || "") as BigNumberish;
    } catch (error) {
      decoded = decodeFunctionData({
        abi: handleOpsAbi,
        data: transaction.input,
      });
      functionFrom = (decoded?.args?.[0]?.[0]?.[0] || "") as HexAddress;
      functionTo = transaction.from;
      functionValue = (parseUnits(transaction.v.toString(), 0) ||
        "") as BigNumberish;
    }

    const amountInWei =
      chain !== "BNB Smart Chain"
        ? parseUnits(amount.toString(), 6)
        : parseUnits(amount.toString(), 18);

    if (receipt.status !== "success") {
      throw new Error("Invalid transaction status");
    }
    if (toLowerCase(transaction.from) !== toLowerCase(from)) {
      throw new Error("Invalid sender address");
    }
    if (toLowerCase(functionTo) !== toLowerCase(to)) {
      throw new Error("Invalid recipient address");
    }
    if (functionValue !== amountInWei) {
      throw new Error("Invalid amount");
    }

    return { success: true };
  } catch (error) {
    await sendMail({
      recipients: ["d.forejtek@gmail.com", "office@coingarage.io"],
      subject: `GARA Coin - Error in transaction validation`,
      content: JSON.stringify(
        { inputData: { chain, txHash, from, to, amount }, error },
        undefined,
        2
      ),
    });
    console.error("Error:", error);
    return { success: false, message: error?.message || "Unknown error" };
  }
}