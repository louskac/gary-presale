import { parseEther, parseUnits, createPublicClient, createWalletClient, Chain } from "viem"
import { type UseSendTransactionParameters, UseSendTransactionReturnType } from "wagmi"
import { sendTransaction } from "@wagmi/core"
// @ts-ignore
// import { useAccount, useBalance, useWalletClient } from "wagmi"
// @ts-ignore
import { BigNumberish, HexAddress, SupportedChains, SupportedTokens } from "@/types"
import { contractAddresses } from "@/components/buy-gara-widget/utils"
import { getRpcNode } from "@/app/api/gara/lib/utils"
import { writeClientTransactionLog } from "@/lib/actions"
import { config } from "@/components/buy-gara-widget/wallet-providers"

type Address = `0x${string}`

const transferAbi = [
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

// const transferFromAbi = parseAbi([
//   "function approve(address spender, uint256 amount) external returns (bool)",
//   "function transferFrom(address from, address to, uint256 value) external returns (bool)",
// ])
type SendPaymentProps = {
  token: SupportedTokens
  chain: Chain
  senderAddress: Address
  recipientAddress: Address
  amount: BigNumberish
  walletClient: ReturnType<typeof createWalletClient>
  setTransactionStatus: (status: { process: string; status: string }) => void
  setOutcomingTransaction: (transaction: { txHash?: HexAddress; done?: boolean; receipt?: any; error?: any }) => void
  setIncomingTransaction: (transaction: { txHash?: HexAddress; done?: boolean; receipt?: any; error?: any }) => void
  resetState: () => void
  sendTransaction: (params: UseSendTransactionParameters) => UseSendTransactionReturnType
}

type SendPaymentResponse = {
  txHash: HexAddress
  receipt: object
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

export const sendPayment = async ({
  token,
  chain,
  senderAddress,
  recipientAddress,
  amount,
  walletClient,
  setTransactionStatus,
  setOutcomingTransaction,
  setIncomingTransaction,
  resetState,
  // sendTransaction,
}: SendPaymentProps): Promise<SendPaymentResponse | undefined> => {
  try {
    if (!token || !chain || !senderAddress || !recipientAddress || !amount || !walletClient) return

    let receipt: any

    const client = createPublicClient({
      chain: chain,
      transport: getRpcNode(chain?.name),
    })

    const chainName = chain?.name as SupportedChains
    // Converts amount to 6 decimals for Polygon and Ethereum, and 18 decimals for BNB Smart Chain
    const amountInWei =
      chainName !== "BNB Smart Chain" ? parseUnits(amount.toString(), 6) : parseUnits(amount.toString(), 18)

    await writeClientTransactionLog({
      account_address: senderAddress,
      chain: chainName,
      token: token,
      log: {
        message: "Transaction initiated",
        amount: amount,
      },
    })

    setTransactionStatus({ process: "sendPayment", status: "writingContract" })

    // const simulateWrite = await client.simulateContract({
    //   address: contractAddresses[token][chainName] as HexAddress,
    //   abi: transferAbi,
    //   functionName: "transfer",
    //   args: [recipientAddress, amountInWei],
    //   account: senderAddress,
    //   chain: chain,
    // })
    // console.log({ simulateWrite })

    // Write contract
    let hash = null

    if (token === "ETH") {
      console.log("Sending ETH transaction")
      console.log({ to: recipientAddress, value: parseEther(String(amount)) })
      const transaction = await sendTransaction(config, {
        to: recipientAddress,
        value: parseEther(String(amount)),
      })
      console.log({ transaction })

      hash = transaction

      if (!hash) {
        throw new Error("Transaction hash is undefined. Ensure the transaction was successfully created.")
      }
    } else {
      hash = await walletClient.writeContract({
        address: contractAddresses[token][chainName] as HexAddress,
        abi: transferAbi,
        functionName: "transfer",
        args: [recipientAddress, amountInWei],
        account: senderAddress,
        chain: chain,
      })

      if (!hash) {
        throw new Error("Contract write transaction failed. Transaction hash is undefined.")
      }
    }

    await writeClientTransactionLog({
      account_address: senderAddress,
      transaction_tx_hash: hash,
      chain: chainName,
      token: token,
      log: {
        message: "Transaction created",
        amount: amount,
      },
    })
    console.log("Transaction sent:", hash)
    setTransactionStatus({ process: "sendPayment", status: "contractCreated" })
    setOutcomingTransaction({ txHash: hash })

    setTransactionStatus({ process: "sendPayment", status: "waitingForReceipt" })

    // Wait for transaction receipt with retry mechanism
    try {
      receipt = await retryWithDelay(() => client.waitForTransactionReceipt({ hash }), 3, 5000) // 3 retries, 5 seconds delay
    } catch (error) {
      console.error("Error waiting for transaction receipt after retries:", error)
      setTransactionStatus({ process: "sendPayment", status: "receiptError" })
      await writeClientTransactionLog({
        account_address: senderAddress,
        transaction_tx_hash: hash,
        chain: chainName,
        token: token,
        log: {
          message: "Error waiting for transaction receipt",
          metadata: {
            // @ts-ignore
            error: error?.message,
          },
        },
      })
      throw error // Re-throw the error to handle it in the outer catch block
    }

    setTransactionStatus({ process: "sendPayment", status: "receiptReceived" })
    setOutcomingTransaction({ receipt, done: true })
    console.log("Transaction confirmed:", receipt)

    return {
      txHash: hash,
      receipt,
    }
  } catch (error) {
    setTransactionStatus({ process: "sendPayment", status: "transactionError" })
    setOutcomingTransaction({ error, done: true })
    setIncomingTransaction({ error, done: true })
    console.error("Error sending ", token, ":", error)
  }
}
