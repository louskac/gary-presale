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
import { waitForTransactionReceipt, writeContract } from "@wagmi/core"

type Address = `0x${string}`

const ethVaultAbi = [
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint8", name: "version", type: "uint8" }],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "startSaleDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "endSaleDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "firstRoundEndDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "secondRoundEndDate", type: "uint256" },
    ],
    name: "SaleDatesUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint256", name: "tokenBalance", type: "uint256" }],
    name: "TokenBalanceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "buyer", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "chainId", type: "uint256" },
    ],
    name: "TokenPurchase",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "ethWithdrawBalance", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "usdtWithdrawBalance", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "usdcWithdrawBalance", type: "uint256" },
    ],
    name: "Withdrawl",
    type: "event",
  },
  {
    inputs: [],
    name: "TOKEN_PRICE_USD_FIRST_STAGE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_PRICE_USD_SECONDE_STAGE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_PRICE_USD_THIRD_STAGE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "assist",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "enum ETHVault.PaymentMethod", name: "paymentMethod", type: "uint8" },
      { internalType: "uint256", name: "paymentAmount", type: "uint256" },
    ],
    name: "buyTokenEthPay",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "paymentAmount", type: "uint256" },
      { internalType: "enum ETHVault.PaymentMethod", name: "paymentMethod", type: "uint8" },
    ],
    name: "calculateTokenAmountPay",
    outputs: [{ internalType: "uint256", name: "buyTokenAmountPay", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "endSaleDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "firstRoundEndDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "contract AggregatorV3Interface", name: "priceFeed", type: "address" }],
    name: "getLatestPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSaleDatesAndBalance",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "initialize", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "secondRoundEndDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_assist", type: "address" }],
    name: "setAssist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_usdt", type: "address" },
      { internalType: "address", name: "_usdc", type: "address" },
    ],
    name: "setStableCoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startSaleDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [{ internalType: "contract IERC20Upgradeable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_startSaleDate", type: "uint256" },
      { internalType: "uint256", name: "_endSaleDate", type: "uint256" },
      { internalType: "uint256", name: "_firstRoundEndDate", type: "uint256" },
      { internalType: "uint256", name: "_secondRoundEndDate", type: "uint256" },
    ],
    name: "updateSaleDates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenBalance", type: "uint256" }],
    name: "updateTokenBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdc",
    outputs: [{ internalType: "contract IERC20Upgradeable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "usdt",
    outputs: [{ internalType: "contract IERC20Upgradeable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "withdraw", outputs: [], stateMutability: "nonpayable", type: "function" },
]
const bnbVaultAbi = [
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint8", name: "version", type: "uint8" }],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "startSaleDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "endSaleDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "firstRoundEndDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "secondRoundEndDate", type: "uint256" },
    ],
    name: "SaleDatesUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint256", name: "tokenBalance", type: "uint256" }],
    name: "TokenBalanceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "buyer", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "chainId", type: "uint256" },
    ],
    name: "TokenPurchase",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "bnbWithdrawBalance", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "usdtWithdrawBalance", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "usdcWithdrawBalance", type: "uint256" },
    ],
    name: "Withdrawl",
    type: "event",
  },
  {
    inputs: [],
    name: "TOKEN_PRICE_USD_FIRST_STAGE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_PRICE_USD_SECONDE_STAGE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_PRICE_USD_THIRD_STAGE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "assist",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "enum BNBVault.PaymentMethod", name: "paymentMethod", type: "uint8" },
      { internalType: "uint256", name: "paymentAmount", type: "uint256" },
    ],
    name: "buyTokenBnbPay",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "paymentAmount", type: "uint256" },
      { internalType: "enum BNBVault.PaymentMethod", name: "paymentMethod", type: "uint8" },
    ],
    name: "calculateTokenAmountPay",
    outputs: [{ internalType: "uint256", name: "buyTokenAmountPay", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "endSaleDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "firstRoundEndDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "contract AggregatorV3Interface", name: "priceFeed", type: "address" }],
    name: "getLatestPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSaleDatesAndBalance",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "initialize", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "secondRoundEndDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_assist", type: "address" }],
    name: "setAssist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_usdt", type: "address" },
      { internalType: "address", name: "_usdc", type: "address" },
    ],
    name: "setStableCoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startSaleDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [{ internalType: "contract IERC20Upgradeable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_startSaleDate", type: "uint256" },
      { internalType: "uint256", name: "_endSaleDate", type: "uint256" },
      { internalType: "uint256", name: "_firstRoundEndDate", type: "uint256" },
      { internalType: "uint256", name: "_secondRoundEndDate", type: "uint256" },
    ],
    name: "updateSaleDates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenBalance", type: "uint256" }],
    name: "updateTokenBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdc",
    outputs: [{ internalType: "contract IERC20Upgradeable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "usdt",
    outputs: [{ internalType: "contract IERC20Upgradeable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "withdraw", outputs: [], stateMutability: "nonpayable", type: "function" },
]
const polVaultAbi = [
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint8", name: "version", type: "uint8" }],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "startSaleDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "endSaleDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "firstRoundEndDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "secondRoundEndDate", type: "uint256" },
    ],
    name: "SaleDatesUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint256", name: "tokenBalance", type: "uint256" }],
    name: "TokenBalanceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "buyer", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "chainId", type: "uint256" },
    ],
    name: "TokenPurchase",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "polWithdrawBalance", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "usdtWithdrawBalance", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "usdcWithdrawBalance", type: "uint256" },
    ],
    name: "Withdrawl",
    type: "event",
  },
  {
    inputs: [],
    name: "TOKEN_PRICE_USD_FIRST_STAGE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_PRICE_USD_SECONDE_STAGE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_PRICE_USD_THIRD_STAGE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "assist",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "enum POLVault.PaymentMethod", name: "paymentMethod", type: "uint8" },
      { internalType: "uint256", name: "paymentAmount", type: "uint256" },
    ],
    name: "buyTokenPolPay",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "paymentAmount", type: "uint256" },
      { internalType: "enum POLVault.PaymentMethod", name: "paymentMethod", type: "uint8" },
    ],
    name: "calculateTokenAmountPay",
    outputs: [{ internalType: "uint256", name: "buyTokenAmountPay", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "endSaleDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "firstRoundEndDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "contract AggregatorV3Interface", name: "priceFeed", type: "address" }],
    name: "getLatestPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSaleDatesAndBalance",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "initialize", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "secondRoundEndDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_assist", type: "address" }],
    name: "setAssist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_usdt", type: "address" },
      { internalType: "address", name: "_usdc", type: "address" },
    ],
    name: "setStableCoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startSaleDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [{ internalType: "contract IERC20Upgradeable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_startSaleDate", type: "uint256" },
      { internalType: "uint256", name: "_endSaleDate", type: "uint256" },
      { internalType: "uint256", name: "_firstRoundEndDate", type: "uint256" },
      { internalType: "uint256", name: "_secondRoundEndDate", type: "uint256" },
    ],
    name: "updateSaleDates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenBalance", type: "uint256" }],
    name: "updateTokenBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdc",
    outputs: [{ internalType: "contract IERC20Upgradeable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "usdt",
    outputs: [{ internalType: "contract IERC20Upgradeable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "withdraw", outputs: [], stateMutability: "nonpayable", type: "function" },
]
const tokenAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "spender", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]
const ethTokenAbi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_upgradedAddress", type: "address" }],
    name: "deprecate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "deprecated",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_evilUser", type: "address" }],
    name: "addBlackList",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "upgradedAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balances",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "maximumFee",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_maker", type: "address" }],
    name: "getBlackListStatus",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
    ],
    name: "allowed",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "who", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "newBasisPoints", type: "uint256" },
      { name: "newMaxFee", type: "uint256" },
    ],
    name: "setParams",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "issue",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "redeem",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "basisPointsRate",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "isBlackListed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_clearedUser", type: "address" }],
    name: "removeBlackList",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "MAX_UINT",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_blackListedUser", type: "address" }],
    name: "destroyBlackFunds",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_initialSupply", type: "uint256" },
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_decimals", type: "uint256" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { anonymous: false, inputs: [{ indexed: false, name: "amount", type: "uint256" }], name: "Issue", type: "event" },
  { anonymous: false, inputs: [{ indexed: false, name: "amount", type: "uint256" }], name: "Redeem", type: "event" },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "newAddress", type: "address" }],
    name: "Deprecate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "feeBasisPoints", type: "uint256" },
      { indexed: false, name: "maxFee", type: "uint256" },
    ],
    name: "Params",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "_blackListedUser", type: "address" },
      { indexed: false, name: "_balance", type: "uint256" },
    ],
    name: "DestroyedBlackFunds",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_user", type: "address" }],
    name: "AddedBlackList",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_user", type: "address" }],
    name: "RemovedBlackList",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Pause", type: "event" },
  { anonymous: false, inputs: [], name: "Unpause", type: "event" },
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
    console.log("send payment passed successfully", token, chain?.name)
    let receipt: any

    const client = createPublicClient({
      chain: chain,
      transport: getRpcNode(chain?.name),
    })

    const chainName = chain?.name as SupportedChains
    // Converts amount to 6 decimals for Polygon and Ethereum, and 18 decimals for BNB Smart Chain
    const amountInWei =
      chainName !== "BNB Smart Chain" ? parseUnits(amount.toString(), 6) : parseUnits(amount.toString(), 18)

    // await writeClientTransactionLog({
    //   account_address: senderAddress,
    //   chain: chainName,
    //   token: token,
    //   log: {
    //     message: "Transaction initiated",
    //     amount: amount,
    //   },
    // })

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
    console.log("payment amount:", amount)
    console.log("chain name", chainName)
    console.log("token", token)
    if (chainName === "Ethereum") {
      if (token === "ETH") {
        hash = await writeContract(config, {
          abi: ethVaultAbi,
          address: "0x8ecE1A114ae4768545211Ec3f5Bb62987165cd79",
          functionName: "buyTokenEthPay",
          args: ["0", "0"],
          value: parseUnits(amount.toString(), 18),
        })

        // const transactionApproveReceipt = await waitForTransactionReceipt(config, {
        //   hash: hash,
        // })

        if (!hash) {
          throw new Error("Contract write transaction failed. Transaction hash is undefined.")
        }
      } else if (token === "USDT") {
        hash = await writeContract(config, {
          abi: ethTokenAbi,
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          functionName: "approve",
          args: ["0x8ecE1A114ae4768545211Ec3f5Bb62987165cd79", parseUnits(amount.toString(), 6)],
        })

        const transactionApproveReceipt = await waitForTransactionReceipt(config, {
          hash: hash,
        })
        if (transactionApproveReceipt.status == "success") {
          hash = await writeContract(config, {
            abi: ethVaultAbi,
            address: "0x8ecE1A114ae4768545211Ec3f5Bb62987165cd79",
            functionName: "buyTokenEthPay",
            args: ["1", parseUnits(amount.toString(), 6)],
          })
        }
        if (!hash) {
          throw new Error("Contract write transaction failed. Transaction hash is undefined.")
        }
      } else if (token === "USDC") {
        hash = await writeContract(config, {
          abi: tokenAbi,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          functionName: "approve",
          args: ["0x8ecE1A114ae4768545211Ec3f5Bb62987165cd79", parseUnits(amount.toString(), 6)],
        })

        const transactionApproveReceipt = await waitForTransactionReceipt(config, {
          hash: hash,
        })
        if (transactionApproveReceipt.status == "success") {
          hash = await writeContract(config, {
            abi: ethVaultAbi,
            address: "0x8ecE1A114ae4768545211Ec3f5Bb62987165cd79",
            functionName: "buyTokenEthPay",
            args: ["2", parseUnits(amount.toString(), 6)],
          })
        }
        if (!hash) {
          throw new Error("Contract write transaction failed. Transaction hash is undefined.")
        }
      }
    } else if (chainName === "BNB Smart Chain") {
      if (token === "BNB") {
        hash = await writeContract(config, {
          abi: bnbVaultAbi,
          address: "0x3027691e9Fe28499DAB102e591a6BA9cc40d0Ead",
          functionName: "buyTokenBnbPay",
          args: ["0", "0"],
          value: parseUnits(amount.toString(), 18),
        })

        // const transactionApproveReceipt = await waitForTransactionReceipt(config, {
        //   hash: hash,
        // })

        if (!hash) {
          throw new Error("Contract write transaction failed. Transaction hash is undefined.")
        }
      } else if (token === "USDT") {
        hash = await writeContract(config, {
          abi: tokenAbi,
          address: "0x55d398326f99059fF775485246999027B3197955",
          functionName: "approve",
          args: ["0x3027691e9Fe28499DAB102e591a6BA9cc40d0Ead", parseUnits(amount.toString(), 18)],
        })

        const transactionApproveReceipt = await waitForTransactionReceipt(config, {
          hash: hash,
        })
        if (transactionApproveReceipt.status == "success") {
          hash = await writeContract(config, {
            abi: bnbVaultAbi,
            address: "0x3027691e9Fe28499DAB102e591a6BA9cc40d0Ead",
            functionName: "buyTokenBnbPay",
            args: ["1", parseUnits(amount.toString(), 18)],
          })
        }
        if (!hash) {
          throw new Error("Contract write transaction failed. Transaction hash is undefined.")
        }
      } else if (token === "USDC") {
        hash = await writeContract(config, {
          abi: tokenAbi,
          address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
          functionName: "approve",
          args: ["0x3027691e9Fe28499DAB102e591a6BA9cc40d0Ead", parseUnits(amount.toString(), 18)],
        })

        const transactionApproveReceipt = await waitForTransactionReceipt(config, {
          hash: hash,
        })
        if (transactionApproveReceipt.status == "success") {
          hash = await writeContract(config, {
            abi: bnbVaultAbi,
            address: "0x3027691e9Fe28499DAB102e591a6BA9cc40d0Ead",
            functionName: "buyTokenBnbPay",
            args: ["2", parseUnits(amount.toString(), 18)],
          })
        }
        if (!hash) {
          throw new Error("Contract write transaction failed. Transaction hash is undefined.")
        }
      }
    } else if (chainName === "Polygon") {
      if (token === "POL") {
        hash = await writeContract(config, {
          abi: polVaultAbi,
          address: "0xAa0B637a5F94CCe6EA5EE11Ed8f00A80fd55a8Be",
          functionName: "buyTokenPolPay",
          args: ["0", "0"],
          value: parseUnits(amount.toString(), 18),
        })

        // const transactionApproveReceipt = await waitForTransactionReceipt(config, {
        //   hash: hash,
        // })

        if (!hash) {
          throw new Error("Contract write transaction failed. Transaction hash is undefined.")
        }
      } else if (token === "USDT") {
        hash = await writeContract(config, {
          abi: tokenAbi,
          address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
          functionName: "approve",
          args: ["0xAa0B637a5F94CCe6EA5EE11Ed8f00A80fd55a8Be", parseUnits(amount.toString(), 6)],
        })

        const transactionApproveReceipt = await waitForTransactionReceipt(config, {
          hash: hash,
        })
        if (transactionApproveReceipt.status == "success") {
          hash = await writeContract(config, {
            abi: polVaultAbi,
            address: "0xAa0B637a5F94CCe6EA5EE11Ed8f00A80fd55a8Be",
            functionName: "buyTokenPolPay",
            args: ["1", parseUnits(amount.toString(), 6)],
          })
        }
        if (!hash) {
          throw new Error("Contract write transaction failed. Transaction hash is undefined.")
        }
      } else if (token === "USDC") {
        hash = await writeContract(config, {
          abi: tokenAbi,
          address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
          functionName: "approve",
          args: ["0xAa0B637a5F94CCe6EA5EE11Ed8f00A80fd55a8Be", parseUnits(amount.toString(), 6)],
        })

        const transactionApproveReceipt = await waitForTransactionReceipt(config, {
          hash: hash,
        })
        if (transactionApproveReceipt.status == "success") {
          hash = await writeContract(config, {
            abi: polVaultAbi,
            address: "0xAa0B637a5F94CCe6EA5EE11Ed8f00A80fd55a8Be",
            functionName: "buyTokenPolPay",
            args: ["2", parseUnits(amount.toString(), 6)],
          })
        }
        if (!hash) {
          throw new Error("Contract write transaction failed. Transaction hash is undefined.")
        }
      }
    }

    // await writeClientTransactionLog({
    //   account_address: senderAddress,
    //   transaction_tx_hash: hash,
    //   chain: chainName,
    //   token: token,
    //   log: {
    //     message: "Transaction created",
    //     amount: amount,
    //   },
    // })
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