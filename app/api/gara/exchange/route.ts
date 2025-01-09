import { NextRequest, NextResponse } from "next/server"
import { privateKeyToAccount } from "viem/accounts"
import { createPublicClient, createWalletClient, http, parseAbi, TransactionReceipt } from "viem"
import { polygon } from "viem/chains"
import { parseUnits } from "viem/utils"
import { HexAddress } from "@/types"
import { getGaraEstimate, validateTransaction } from "@/app/api/gara/lib/utils"
import { usdcToGara } from "@/app/api/gara/lib/utils"
import { sendMail } from "@/lib/mailer"
import { universal } from "@/lib/email-templates/universal"
import {
  createTransaction,
  createTransactionLog,
  getTransactionByTxHash,
  updateTransactionByTxHash,
} from "@/lib/db/helpers"

export const maxDuration = 60
export const dynamic = "force-dynamic"

// Infura API key and URL
const privateKey = process.env.INFURA_API_KEY
const infuraUrl = process.env.INFURA_URL

// GARA token contract address and ABI
const garaTokenContractAddress = (process.env.NEXT_PUBLIC_GARA_CONTRACT_ADDRESS || "") as HexAddress
const garaAbi = [
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

const allowedChains = ["Polygon", "Ethereum", "BNB Smart Chain"] // Add more chains if needed

export async function POST(req: NextRequest) {
  try {
    let receipt: TransactionReceipt | undefined
    let garaTxHash: HexAddress | undefined = undefined

    // amount in USDC
    const { txHash, from, to, amount, chain, token } = await req.json()

    // check if transaction wasn't already processed
    const existingTransaction = await getTransactionByTxHash(txHash)
    console.log("Existing transaction:", existingTransaction)
    if (existingTransaction.length) {
      await createTransactionLog({
        transaction_tx_hash: txHash,
        log: { message: "Transaction already processed" },
      })
      return NextResponse.json({ success: false, message: "Transaction already processed" }, { status: 400 })
    }

    await createTransaction({
      tx_hash: txHash,
      from,
      to,
      amount_received: amount,
      chain,
      token,
      status: "pending",
    })

    if (!allowedChains.includes(chain)) {
      await updateTransactionByTxHash(txHash, { status: "failed" })
      await createTransactionLog({
        transaction_tx_hash: txHash,
        log: { message: "Invalid chain" },
      })
      return NextResponse.json({ success: false, message: "Invalid chain" }, { status: 400 })
    }

    await createTransactionLog({
      transaction_tx_hash: txHash,
      log: { message: "Running validation" },
    })
    // Validate the transaction
    const validation = await validateTransaction({
      chain,
      txHash,
      from,
      to,
      amount,
    })

    if (!validation.success) {
      await updateTransactionByTxHash(txHash, { status: "failed" })
      await createTransactionLog({
        transaction_tx_hash: txHash,
        log: { message: validation.message },
      })
      return NextResponse.json({ success: false, message: validation.message }, { status: 400 })
    }
    let amountInGara
    // Convert the amount to GARA by fixed rate
    if (["USDC", "USDT"].includes(token)) {
      amountInGara = usdcToGara(amount)
    } else {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
      const data = await response.json()
      amountInGara = getGaraEstimate(token, amount, data.ethereum.usd)
    }

    // security measure for test, if amount is greater than 1, set to 1
    // if (amount > 1) amountInGara = 1

    // naming convention cahnge due to form on FE is customer -> coingarage
    // change from -> to logic
    const garaTo = from
    // const garaFrom = garaTokenContractAddress

    // Convert the amount to Wei (e.g. 6 decimal places for GARA token)
    const amountInWei = parseUnits(amountInGara.toString(), 6)

    // Create a wallet client for transactions
    const account = privateKeyToAccount(("0x" + privateKey) as HexAddress)

    const walletClient = createWalletClient({
      account,
      chain: polygon,
      transport: http(infuraUrl),
    })

    try {
      await createTransactionLog({
        transaction_tx_hash: txHash,
        log: {
          message: "Sending $GARA",
          metadata: {
            to: garaTo,
            garaAmount: amountInGara,
            garaAmountInWei: amountInWei.toString(),
          },
        },
      })
      // Writing to a contract using writeContract
      garaTxHash = await walletClient.writeContract({
        account,
        address: garaTokenContractAddress,
        abi: garaAbi,
        functionName: "transfer",
        args: [garaTo, amountInWei],
        chain: polygon,
      })

      await createTransactionLog({
        transaction_tx_hash: txHash,
        log: {
          message: "$GARA sent",
          metadata: {
            garaTxHash,
          },
        },
      })
      console.log("Transaction hash:", garaTxHash)
    } catch (error) {
      console.error("Error sending $GARA token:", error)
      await createTransactionLog({
        transaction_tx_hash: txHash,
        log: {
          message: "Error sending $GARA",
          metadata: {
            // @ts-ignore
            error: error?.message,
          },
        },
      })
      await updateTransactionByTxHash(txHash, { status: "failed" })
      throw new Error("Error sending $GARA token")
    }

    try {
      // Wait for the transaction to be mined (optional)
      const publicClient = createPublicClient({ chain: polygon, transport: http() })
      receipt = await publicClient.waitForTransactionReceipt({ hash: garaTxHash! })
      const parsedReceipt = JSON.stringify(receipt, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
      await createTransactionLog({
        transaction_tx_hash: txHash,
        log: {
          message: "$GARA transaction confirmed",
          metadata: {
            receipt: parsedReceipt,
          },
        },
      })
    } catch (error) {
      console.error("Error waiting for transaction receipt:", error)
      await createTransactionLog({
        transaction_tx_hash: txHash,
        log: {
          message: "Error waiting for transaction receipt",
          metadata: {
            // @ts-ignore
            error: error?.message,
          },
        },
      })
      throw new Error("Error waiting for transaction receipt")
    }
    // console.log("Transaction confirmed:", receipt)

    try {
      await sendMail({
        recipients: ["d.forejtek@gmail.com"],
        subject: `$GARA Coin - New transaction`,
        content: universal({
          data: {
            usdChain: chain,
            usdTxHash: txHash,
            to: garaTo,
            token,
            amount: `${amount} ${token}`,
            garaTxHash,
          },
        }),
      })
    } catch (error) {
      console.error("Error sending email:", error)
    }

    await updateTransactionByTxHash(txHash, { status: "success" })
    return NextResponse.json({ success: true, txHash: garaTxHash, status: receipt?.status })
  } catch (error) {
    console.error("Error sending $GARA token:", error)
    await sendMail({
      recipients: ["d.forejtek@gmail.com", "office@coingarage.io"],
      subject: `$GARA Coin - Error in sending $GARA`,
      // @ts-ignore
      content: JSON.stringify({ error: error?.message }, undefined, 2),
    })
    // @ts-ignore
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 })
  }
}
