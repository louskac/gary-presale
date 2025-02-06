import { polygon, mainnet, sepolia, bsc, bscTestnet, type Chain } from "viem/chains"
import { BigNumberish, HexAddress } from "@/types"
import { createPublicClient, decodeFunctionData, http, parseAbi, parseEther, parseUnits } from "viem"
import { sendMail } from "@/lib/mailer"

export const getGaraEstimate = (round: number, token: string, amount: number, tokenValue?: number) => {
  console.log(round)
  if (!token || !amount) return 0
  let price = 0.12 //L: change these amounts with price change

  if (token === "USDC" || token === "USDT") {
    return amount / price
  }

  if (!tokenValue) return 0
  return amount * tokenValue
}

export const usdcToGara = (usdc: number) => usdc / 0.12 //L: change these amounts with price change

export const getChainByName = (chain: string): Chain => {
  switch (chain) {
    case "Polygon":
      return polygon
    case "Ethereum":
      return mainnet
    case "BNB Smart Chain":
      return bsc
    default:
      return polygon
  }
}

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
]

const handleOpsAbi = parseAbi([
  "function handleOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],address)",
])

export function validateTransactionHash(txHash: string) {
  return /^(0x)?[0-9a-fA-F]{64}$/.test(txHash)
}

function toLowerCase(address: string) {
  if (!address || typeof address !== "string") return ""
  return address.toLowerCase()
}

export const ethereumRpcUrl =
  process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/dNMADuse_UiHTjTasg3_E2ezx8IpNcxF"
export const polygonRpcUrl =
  process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/vbBKw_KLTIW6P9CvewSXZrgbaAlhcg9r"
export const bscRpcUrl =
  process.env.NEXT_PUBLIC_BSC_RPC_URL || "https://bnb-mainnet.g.alchemy.com/v2/dNMADuse_UiHTjTasg3_E2ezx8IpNcxF"

export const getRpcNode = (chain: string) => {
  //monda
  switch (chain) {
    case "Ethereum":
      return http(ethereumRpcUrl)
    case "Polygon":
      return http(polygonRpcUrl)
    case "BNB Smart Chain":
      return http(bscRpcUrl)
    default:
      return http()
  }
}
// Helper function for retrying with a delay
const retryWithDelay = async (fn: () => Promise<any>, retries: number, delay: number) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i < retries - 1) {
        console.log(`Retry ${i + 1}/${retries} failed, retrying in ${delay / 1000} seconds...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        throw error // If all retries fail, throw the error
      }
    }
  }
}

export async function validateTransaction({
  chain,
  txHash,
  from,
  to,
  amount,
}: {
  chain: string
  txHash: HexAddress
  from: HexAddress
  to: HexAddress
  amount: string
}) {
  console.log({ chain, txHash, from, to, amount })
  try {
    if (!validateTransactionHash(txHash)) {
      throw new Error("Invalid transaction hash")
    }
    const _chain = getChainByName(chain)
    const transport = getRpcNode(chain)
    const publicClient = createPublicClient({
      chain: _chain,
      transport: transport,
    })

    let decoded
    let functionTo = "" as HexAddress
    let functionFrom = "" as HexAddress
    let functionValue = "" as BigNumberish

    // Retry mechanism for getTransactionReceipt with a 5-second delay and 3 retries
    const receipt = await retryWithDelay(() => publicClient.getTransactionReceipt({ hash: txHash }), 3, 5000)
    console.log({ receipt })
    if (receipt?.from === from) functionFrom = receipt.from
    if (receipt?.to === to) functionTo = receipt.to

    const transaction = await publicClient.getTransaction({ hash: txHash })
    console.log({ transaction })
    if (!functionFrom) functionFrom = transaction?.from
    if (!functionTo) functionTo = transaction?.to
    if (!functionValue) functionValue = parseUnits(transaction.value.toString(), 0)

    if (!functionFrom || !functionTo || !functionValue) {
      try {
        decoded = decodeFunctionData({
          abi: erc20Abi,
          data: transaction.input,
        })
        console.log({ decoded })
        if (!functionFrom) functionFrom = transaction?.from
        if (!functionTo) functionTo = (decoded?.args?.[0] || "") as HexAddress
        if (!functionValue) functionValue = (decoded?.args?.[1] || "") as BigNumberish
      } catch (error) {
        decoded = decodeFunctionData({
          abi: handleOpsAbi,
          data: transaction.input,
        })
        console.log({ decoded })
        if (!functionFrom) functionFrom = (decoded?.args?.[0]?.[0]?.[0] || "") as HexAddress
        if (!functionTo) functionTo = transaction?.from
        if (!functionValue) functionValue = (parseUnits(transaction.v.toString(), 0) || "") as BigNumberish
      }
    }

    console.log("values after check")
    console.log({ functionFrom, functionTo, functionValue })

    let amountInWei
    if (chain === "Ethereum") {
      amountInWei = parseEther(amount.toString())
      // amountInWei = parseUnits(amount.toString(), 18)
    } else if (chain !== "BNB Smart Chain") {
      amountInWei = parseUnits(amount.toString(), 6)
    } else {
      amountInWei = parseUnits(amount.toString(), 18)
    }

    console.log({ amountInWei })

    if (receipt.status !== "success") {
      throw new Error("Invalid transaction status")
    }
    if (toLowerCase(functionFrom) !== toLowerCase(from)) {
      throw new Error("Invalid sender address")
    }
    if (toLowerCase(functionTo) !== toLowerCase(to)) {
      throw new Error("Invalid recipient address")
    }
    console.log({ functionValue, amountInWei })
    if (functionValue !== amountInWei) {
      throw new Error("Invalid amount")
    }

    return { success: true }
  } catch (error) {
    await sendMail({
      recipients: ["d.forejtek@gmail.com", "office@coingarage.io"],
      subject: `GARA Coin - Error in transaction validation`,
      content: JSON.stringify({ inputData: { chain, txHash, from, to, amount }, error }, undefined, 2),
    })
    console.error("Error:", error)
    return { success: false, message: error?.message || "Unknown error" }
  }
}
