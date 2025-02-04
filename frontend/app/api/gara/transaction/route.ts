import { getChainByName, getRpcNode } from "@/app/api/gara/lib/utils"
import { BigNumberish, HexAddress } from "@/types"
import { NextRequest, NextResponse } from "next/server"
import { createPublicClient, http, decodeFunctionData, parseAbi, parseUnits } from "viem"

// import { privateKeyToAccount } from "viem/accounts"
// import { polygon } from "viem/chains"

// Infura API key and URL
// const privateKey = process.env.INFURA_API_KEY
// const infuraUrl = process.env.INFURA_URL

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

export async function POST(req: NextRequest) {
  try {
    const { txHash, chain } = await req.json()

    // validate txHash is valid
    if (!/^(0x)?[0-9a-fA-F]{64}$/.test(txHash)) {
      return NextResponse.json({ success: false, message: "Invalid transaction hash" }, { status: 400 })
    }

    const _chain = getChainByName(chain)
    const publicClient = createPublicClient({ chain: _chain, transport: getRpcNode(chain) })
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash })
    console.log({ logs: receipt.logs })
    const transaction = await publicClient.getTransaction({ hash: txHash })
    console.log({ transaction })
    let decoded
    let functionTo = "" as HexAddress
    let functionValue = "" as BigNumberish
    try {
      decoded = decodeFunctionData({
        abi: erc20Abi,
        data: transaction.input,
      })
      functionTo = (decoded?.args?.[0] || "") as HexAddress
      functionValue = (decoded?.args?.[1] || "") as BigNumberish
    } catch (error) {
      decoded = decodeFunctionData({
        abi: handleOpsAbi,
        data: transaction.input,
      })
      functionTo = (decoded?.args?.[0]?.[0]?.[0] || "") as HexAddress
      functionValue = (parseUnits(transaction.v.toString(), 0) || "") as BigNumberish
    }

    console.log({
      functionTo,
      functionValue,
    })

    return NextResponse.json({
      success: true,
      transactionHash: txHash,
      to: functionTo,
      amount: functionValue.toString(),
      status: receipt.status,
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 })
  }
}
