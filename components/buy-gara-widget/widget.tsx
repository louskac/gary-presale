"use client"

import { useEffect, useState } from "react"
import { isAddress, parseUnits } from "viem"
// @ts-ignore
import { useAccount, useBalance, useSendTransaction, useWalletClient, useWriteContract } from "wagmi"
// @ts-ignore
import { useAddRecentTransaction, useChainModal } from "@rainbow-me/rainbowkit"
import { ConnectButton } from "@/components/buy-gara-widget/connect-button"
import { z } from "zod"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { BigNumber, ethers } from "ethers"

import { CoinInput } from "@/components/buy-gara-widget/coin-input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { cn, formatAmount } from "@/lib/utils"
import { useForm, useWatch } from "react-hook-form"
import { getGaraEstimate, usdcToGara } from "@/app/api/gara/lib/utils"
import { useGaraStore } from "@/lib/store/provider"
import TransactionStatusModal from "@/components/buy-gara-widget/transaction-status-modal"
import { sendPayment } from "@/lib/send-payment"
import { CurrencySelect } from "@/components/buy-gara-widget/currency-select"
import { getTokenBalance } from "@/lib/get-balance"

import Arrow from "@/public/images/gara-coin/arrow.svg"
import Polygon from "@/public/images/gara-coin/pol.png"
import CountdownTimer from "@/components/countdown-timer"
import ProgressBar from 'modified-react-progress-bar.git/@ramonak/react-progress-bar'

import { useSwitchChain } from "wagmi"
import { mainnet, polygon, bsc } from "@wagmi/core/chains"
import { getChainByName } from "@/app/api/gara/lib/utils"
import { ReferralPopup } from "@/components/popup-referal"

// const COINGARAGE_CONTRACT_ADDRESS = "0xA4AC096554f900d2F5AafcB9671FA84c55cA3bE1" as `0x${string}`
const COINGARAGE_CONTRACT_ADDRESS = "0x3027691e9Fe28499DAB102e591a6BA9cc40d0Ead" as `0x${string}`
const TOKENS_SOLD = 652989

const TOTAL_TOKEN_AMOUNT = 99000000
const endDate = 1740787199
const firstRoundEndDate = 1735689599
const secondRoundEndDate = 1738367999
const polygonRpcUrl = "https://polygon-mainnet.g.alchemy.com/v2/" + process.env.NEXT_PUBLIC_POLYGON_RPC_KEY
const ethRpcUrl = "https://eth-mainnet.g.alchemy.com/v2/" + process.env.NEXT_PUBLIC_ETH_RPC_KEY
const bscRpcUrl = "https://bnb-mainnet.g.alchemy.com/v2/" + process.env.NEXT_PUBLIC_BSC_RPC_KEY

const polygonProvider = new ethers.providers.JsonRpcProvider(polygonRpcUrl)
const ethProvider = new ethers.providers.JsonRpcProvider(ethRpcUrl)
const bscProvider = new ethers.providers.JsonRpcProvider(bscRpcUrl)

const contractAddress = "0x8ecE1A114ae4768545211Ec3f5Bb62987165cd79"

const ethAddress = "0x8ecE1A114ae4768545211Ec3f5Bb62987165cd79"
const polygonAddress = "0xAa0B637a5F94CCe6EA5EE11Ed8f00A80fd55a8Be"
const bscAddress = "0x3027691e9Fe28499DAB102e591a6BA9cc40d0Ead"

const handleWalletConnect = () => {
  console.log("wallet connect triggered")
  // Trigger Google Analytics event
  if (typeof gtag === "function") {
    gtag("event", "wallet")
  }

  // Trigger Facebook Pixel event
  if (typeof fbq === "function") {
    fbq("track", "Lead")
  }
}

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
const bscVaultAbi = [
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
const contractAbi = [
  {
    inputs: [
      { internalType: "address", name: "_tokenAddress", type: "address" },
      { internalType: "uint256", name: "_startSaleDate", type: "uint256" },
      { internalType: "uint256", name: "_endSaleDate", type: "uint256" },
      { internalType: "uint256", name: "_firstRoundEndDate", type: "uint256" },
      { internalType: "uint256", name: "_secondRoundEndDate", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "startSaleDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "endSaleDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "firstRoundEndDate", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "secondRoundEndDate", type: "uint256" },
    ],
    name: "SaleDateUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint256", name: "newBalance", type: "uint256" }],
    name: "TokenBalanceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "buyer", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "TokensSoldUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "assist",
    outputs: [{ internalType: "address", name: "", type: "address" }],
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
    name: "getEndSaleDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStartSaleDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTokenBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getfirstRoundEndDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getsecondRoundEndDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "buyer", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "handleTokenPurchase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
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
    inputs: [{ internalType: "address", name: "_newOwner", type: "address" }],
    name: "setOwner",
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
    name: "setSaleDate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_token", type: "address" }],
    name: "setToken",
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
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "tokensSoldPerUser",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vaultContractAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "_token", type: "address" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "withdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

const formSchema = z.object({
  to: z.string().refine((value) => isAddress(value), {
    message: "Invalid Address",
  }),
  from: z.string().refine((value) => isAddress(value), {
    message: "Invalid Address",
  }),
  garaEstimate: z.string(),
  amount: z.string(),
  token: z.string(),
})

const calculateRound = () => {
  const currentTime = new Date().getTime()
  if (firstRoundEndDate * 1000 > Number(currentTime)) {
    return 1
  } else if (secondRoundEndDate * 1000 > Number(currentTime)) {
    return 2
  } else if (endDate * 1000 > Number(currentTime)) {
    return 3
  }
}

export function BuyGara({ className, hideHeader = false }: { className?: string; hideHeader?: boolean }) {
  const [currentNetworkId, setCurrentNetworkId] = useState(1)
  const [hasFetchedOnLoad, setHasFetchedOnLoad] = useState(false)
  const [activeButton, setActiveButton] = useState("ethereum") // Default active button
  const { switchChainAsync } = useSwitchChain()
  const [showPopup, setShowPopup] = useState(false)

  //@ts-ignore
  async function changeChain(chains) {
    try {
      const _chain = getChainByName(chains)
      //@ts-ignore
      const switchedChain = await switchChainAsync({ chainId: _chain.id })
      //@ts-ignore
      console.log("Switched to chain:", switchedChain.id)
      setCurrentNetworkId(switchedChain.id)
      // console.log('Switched to chain:', chain&&chain?.id);
    } catch (error) {
      //@ts-ignore
      console.error("Failed to switch chain:", error.message)
    }
  }
  //L: Here implement the functions
  //L: After wallet connect this entire logic and the 3 frontend buttons can be hidden so it won't confuse users (once wallet is connected only way to switch networks is the current way thru the connect button)
  const switchToEthereum = async () => {
    console.log("Switching to Ethereum")
    await changeChain("Ethereum")
    //L: Switch the network to etheruem (the default state)
    //L: Currency select will have USDT, USDC and ETH currencies
    //L: Please fix the minimum amount check to work here as well (before the wallet connect)
  }

  const switchToPolygon = async () => {
    console.log("Switching to Polygon", polygon.id)
    await changeChain("Polygon")
    //L: Switch the network to polygon
    //L: Currency select will have USDT, USDC and POL currencies
  }

  const switchToBSC = async () => {
    console.log("Switching to Binance Smart Chain")
    await changeChain("BNB Smart Chain")
    //L: Switch the network to polygon
    //L: Currency select will have USDT, USDC and BSC currencies
  }

  const handleNetworkSwitch = (network) => {
    setActiveButton(network)
    switch (network) {
      case "ethereum":
        switchToEthereum()
        break
      case "polygon":
        switchToPolygon()
        break
      case "bsc":
        switchToBSC()
        break
      default:
        console.error("Unknown network:", network)
    }
  }

  const t = useTranslations("GARA.main.buyGARA")
  const [tokenSold, setTokenSold] = useState(0)
  const [nativeUSD, setNativeUSD] = useState(0)
  const sepoliaContract = new ethers.Contract(ethAddress, ethVaultAbi, ethProvider)
  const bscContract = new ethers.Contract(bscAddress, bscVaultAbi, bscProvider)
  const polygonContract = new ethers.Contract(polygonAddress, polVaultAbi, polygonProvider)

  async function readContractFunction() {
    const contract = new ethers.Contract(contractAddress, contractAbi, polygonProvider)

    try {
      const tokenBalance = await contract.getTokenBalance()
      //console.log("tokenBalance", Math.floor(tokenBalance))
      setTokenSold(TOTAL_TOKEN_AMOUNT - Math.floor(tokenBalance / 10 ** 6) + TOKENS_SOLD)
      // return Math.floor(tokenBalance/10**18)
    } catch (error) {
      console.error("Error reading contract function:", error)
    }
  }

  useEffect(() => {
    // Fetch data immediately when the component mounts
    readContractFunction()

    // Set up an interval to fetch data every second
    const interval = setInterval(readContractFunction, 5000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)
  }, [])
  const {
    transactionStatus,
    setTransactionStatus,
    setOutcomingTransaction,
    setIncomingTransaction,
    reset: resetState,
  } = useGaraStore((state) => state)
  const { address, chain } = useAccount()

  useEffect(() => {
    if (chain?.id === 1) {
      setActiveButton("ethereum")
    } else if (chain?.id === 137) {
      setActiveButton("polygon")
    } else if (chain?.id === 56) {
      setActiveButton("bsc")
    }
  }, [chain?.id])
  useEffect(() => {
    // Trigger analytics when a wallet is connected
    console.log("wallet connected")

    if (address) {
      handleWalletConnect()
    }
  }, [address])

  useEffect(() => {
    const fetchPrice = async () => {
      // Default to Ethereum chain if no chain is connected
      const currentChainId = chain?.id || currentNetworkId

      if (currentChainId === 1) {
        // ETH
        const tokenBalance = await sepoliaContract.calculateTokenAmountPay(parseUnits("1", 18), 0)
        console.log("ETH: " + ethers.utils.formatUnits(tokenBalance.toString(), 6))
        setNativeUSD(Number(ethers.utils.formatUnits(tokenBalance.toString(), 6)))
      } else if (currentChainId === 56) {
        // BNB
        const tokenBalance = await bscContract.calculateTokenAmountPay(parseUnits("1", 18), 0)
        console.log("BNB: " + ethers.utils.formatUnits(tokenBalance.toString(), 6))
        setNativeUSD(Number(ethers.utils.formatUnits(tokenBalance.toString(), 6)))
      } else {
        // POL
        const tokenBalance = await polygonContract.calculateTokenAmountPay(parseUnits("1", 18), 0)
        console.log("POL: " + ethers.utils.formatUnits(tokenBalance.toString(), 6))
        setNativeUSD(Number(ethers.utils.formatUnits(tokenBalance.toString(), 6)))
      }
    }

    // Run once on load with default chain
    if (!hasFetchedOnLoad) {
      fetchPrice()
      setHasFetchedOnLoad(true)
    }

    // Run normally when dependencies change
    if (chain || currentNetworkId) {
      fetchPrice()
    }
  }, [chain, hasFetchedOnLoad, currentNetworkId])

  // const eth_usd = data?.ethereum?.usd

  const [open, setOpen] = useState(false)
  const [hasUnsufficientBalance, setHasUnsufficientBalance] = useState(false)
  const [hasLowerInputBalance, setHasLowerInputBalance] = useState(false)
  const [isCalculatingMinBalance, setIsCalculatingMinBalance] = useState(false)
  const toggleOpen = () => setOpen(!open)
  const handleOnOpenChange = () => {
    setOpen(!open)
    resetState()
  }

  const { data: balance } = useBalance({ address })
  const { data: walletClient } = useWalletClient()
  const addRecentTransaction = useAddRecentTransaction()
  const { writeContract } = useWriteContract()
  const { openChainModal } = useChainModal()
  const { sendTransaction } = useSendTransaction()
  const chainTxUrl = `${chain?.blockExplorers?.default?.url}/tx/`

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    // resolver: zodResolver(formSchema),
    defaultValues: {
      garaEstimate: usdcToGara(10).toString(),
      amount: "0",
      to: COINGARAGE_CONTRACT_ADDRESS,
      from: address,
      token: "USDT",
    },
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form

  const amount = useWatch({
    control: form.control,
    name: "amount",
  })

  const token = useWatch({
    control: form.control,
    name: "token",
  })

  const [minBalance, setMinBalance] = useState(10)
  const [minTokenBalance, setMinTokenBalance] = useState(0)

  useEffect(() => {
    if (!address || !token || !chain || !nativeUSD) return

    const calculateMinTokenBalance = async () => {
      setIsCalculatingMinBalance(true) // calculate timer after changing chain solver

      if (chain?.name === "Ethereum") {
        setMinBalance(20)
        console.log("ETH")
      } else {
        setMinBalance(20)
        console.log("Not ETH")
      }

      if (token === "USDC" || token === "USDT") {
        setMinTokenBalance(minBalance)
      } else {
        const calculatedMinBalance = minBalance / (nativeUSD / 10)
        setMinTokenBalance(calculatedMinBalance)
      }

      setIsCalculatingMinBalance(false)
    }

    calculateMinTokenBalance()

    if (Number(amount) < minTokenBalance) {
      form.setError("amount", { message: `Amount must be greater than $${minTokenBalance}` })
      setHasLowerInputBalance(true)
    } else {
      form.clearErrors("amount")
      setHasLowerInputBalance(false)
    }

    if (token === "ETH" || token === "POL" || token === "BNB") {
      const isInsufficientBalance = Number(balance?.formatted) < Number(amount)

      if (isInsufficientBalance) {
        form.setError("amount", { message: "Insufficient balance" })
      } else {
        form.clearErrors("amount")
      }
      setHasUnsufficientBalance(isInsufficientBalance)
    } else {
      try {
        const fetchBalance = async () => {
          const balance = await getTokenBalance({
            walletAddress: address as string,
            token: token,
            chainName: chain?.name as string,
          })
          const isInsufficientBalance = balance?.humanReadableBalance < Number(amount)
          if (isInsufficientBalance) {
            form.setError("amount", { message: "Insufficient balance" })
          } else {
            form.clearErrors("amount")
          }
          setHasUnsufficientBalance(isInsufficientBalance)
        }

        fetchBalance()
      } catch (error) {
        console.error(error)
      }
    }
  }, [amount, address, balance, token, chain, nativeUSD])

  useEffect(() => {
    const round = calculateRound()
    const garaEstimate = getGaraEstimate(
      round,
      token,
      Number(amount),
      !["USDT", "USDC"].includes(nativeUSD.toString()) ? nativeUSD : undefined
    )
    setValue(
      "garaEstimate",
      garaEstimate.toLocaleString("en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
    )
  }, [amount, token, form])

  useEffect(() => {
    setValue("from", address as `0x${string}`)
  }, [address, form])

  useEffect(() => {
    if (chain?.name !== "Ethereum") {
      setValue("token", "USDT")
    }
    if (chain?.name === "Ethereum") {
      setValue("token", "ETH")
    }
  }, [chain, currentNetworkId])

  useEffect(() => {
    if (token === "ETH" && chain?.name !== "Ethereum") {
      if (typeof openChainModal === "function") {
        openChainModal()
      }
    }
  }, [token, chain, openChainModal])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { amount, token } = data
    console.log("onSubmit amount, token", amount, token, chain?.id)

    const to = COINGARAGE_CONTRACT_ADDRESS
    if (!address || !walletClient) {
      setTransactionStatus({ process: "sendPayment", status: "walletError" })
      return
      // handle state
    }
    handleOnOpenChange()
    setTransactionStatus({ process: "sendPayment", status: "submitting" })
    console.log("sendPayment call")
    console.log({
      token,
      chain,
      amount: amount,
      recipientAddress: to,
      senderAddress: address,
      walletClient,
    })
    const response = await sendPayment({
      token,
      chain,
      amount: amount,
      recipientAddress: to,
      senderAddress: address,
      walletClient,
      setTransactionStatus,
      setOutcomingTransaction,
      setIncomingTransaction,
      resetState,
      writeContract,
      sendTransaction,
    })
    if (!response?.txHash) {
      setTransactionStatus({
        process: "sendPayment",
        status: "transactionError",
      })
      return
    }
    addRecentTransaction({
      hash: response.txHash,
      description: "Exchange USDC to GARA",
    })

    setTransactionStatus({ process: "receivePayment", status: "pending" })

    // Successful deposit: Trigger purchase event
    const depositValue = parseFloat(amount).toFixed(2)

    console.log("buy button triggered")

    let usdValue = depositValue // Default to USD value if already in USD

    // Check if the currency is not USD (e.g., ETH, BNB, etc.)
    if (token === "ETH" || token === "BNB" || token === "POL") {
      try {
        // Assuming `nativeUSD` is the value of 1 ETH/BNB/POL in USD
        const currentRate = nativeUSD // Use your `nativeUSD` calculation from earlier

        if (currentRate) {
          usdValue = depositValue * currentRate * 0.1 // Convert to USD
        } else {
          console.warn("Exchange rate not available, defaulting to deposit value")
        }
      } catch (error) {
        console.error("Error calculating USD value:", error)
      }
    }
    // Google Analytics
    if (typeof gtag === "function") {
      gtag("event", "purchase", {
        value: usdValue.toFixed(2), // Ensure a consistent format
        currency: "USD",
      })
    }

    // Facebook Pixel
    if (typeof fbq === "function") {
      fbq("track", "Purchase", { value: usdValue.toFixed(2), currency: "USD" })
    }

    // const garaTransactionResponse = await fetch("/api/gara/exchange", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     txHash: response.txHash,
    //     from: address,
    //     to: to,
    //     amount,
    //     chain: chain?.name,
    //     token,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    // const responseData = await garaTransactionResponse.json()
    // console.log("GARA Transaction Response:", responseData)
    // if (!garaTransactionResponse.ok) {
    //   setTransactionStatus({
    //     process: "receivePayment",
    //     status: "transactionError",
    //   })
    //   setIncomingTransaction({ done: true, error: responseData.message })
    //   return
    // }
    addRecentTransaction({
      hash: response?.txHash,
      description: "Incoming GARA",
    })
    setIncomingTransaction({
      done: true,
      txHash: response?.txHash,
      // receipt: responseData?.status,
    })
    setTransactionStatus({ process: "receivePayment", status: "paymentSent" })
    reset()
  }

  useEffect(() => {
    const progressBarFillers = document.querySelectorAll("#progress-bar-filler")

    if (progressBarFillers.length > 0) {
      // Ensure each progress bar has the animation
      progressBarFillers.forEach((progressBarFiller) => {
        // Ensure the progress bar has relative positioning
        progressBarFiller.style.position = "relative"

        // Create arrow container
        const arrowContainer = document.createElement("div")
        arrowContainer.className = "absolute inset-0 flex items-center justify-start pointer-events-none arrow"

        // Add spans for the arrows
        for (let i = 0; i < 3; i++) {
          const arrow = document.createElement("span")
          arrow.className =
            "block w-[3vw] h-[3vw] border-b-[25px] border-r-[25px] lg:w-[1.5vw] lg:h-[1.5vw] lg:border-b-[5px] lg:border-r-[5px] border-white transform rotate-45"
          if (i === 1) arrow.style.animationDelay = "-0.2s"
          if (i === 2) arrow.style.animationDelay = "-0.4s"
          arrowContainer.appendChild(arrow)
        }

        // Append arrow container to the progress bar filler
        progressBarFiller.appendChild(arrowContainer)
      })

      const style = document.createElement("style")
      style.textContent = `
        @keyframes animate {
          0% {
            opacity: 0;
            transform: rotate(315deg) translate(-10px, -10px);
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: rotate(315deg) translate(10px, 10px);
          }
        }
  
        .arrow span {
          animation: animate 2s infinite;
          margin: -10px;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const setAmountValue = (value: string) => {
    form.setValue("amount", value)
  }

  useEffect(() => {
    setAmountValue('20');
  }, []);

  const getRefferalLink = () => {
    console.log("Referral link requested");
    setShowPopup(true)
    //L: Your implemetation logic here
  };

  return (
    <section
      id="buy-gara"
      className={cn(
        "relative mb-20 w-full max-w-[420px] flex-1 rounded-2xl bg-white p-6 px-5 shadow-md lg:rounded-t-2xl lg:ml-auto",
        className
      )}
    >
      <div className="mt-4 grid grid-cols-[1fr_280px_1fr] gap-2">
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black dark:bg-neutral-700"></div>
        </div>
        <p className="text-center font-heading text-xl font-black">Countdown to Price Increase</p>
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black dark:bg-neutral-700"></div>
        </div>
      </div>
      <div className="my-4 flex flex-row justify-center">
        <CountdownTimer />
      </div>
      <div className="flex flex-col items-center justify-between rounded-md p-4">
        <div className="flex w-full justify-between text-lg text-gray-800">
          <span>
            Current Price: <span className="font-bold text-gary-pink">$0.12</span>
          </span>
          <span>
            Listing price: <span className="font-bold text-gray-900">$0.36</span>
          </span>
        </div>
        <div className="relative my-2 w-full">
          <ProgressBar
            completed={((tokenSold / 4000000) * 100).toFixed(2)}
            animateOnRender={true}
            isLabelVisible={false}
            height="16px"
            bgColor="#28E0B9"
            baseBgColor="#0D1E35"
            borderRadius="20px"
            className=""
          />
        </div>
        <p className="text-center text-lg text-gray-800">
          Raised: <span className="font-black text-gray-900">${new Intl.NumberFormat("en-US").format(tokenSold)}</span>{" "}
          / $4,000,000
        </p>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_220px_1fr] gap-2 lg:hidden">
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black dark:bg-neutral-700"></div>
        </div>
        <p className="text-center font-heading text-lg">Presale payment methods</p>
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black dark:bg-neutral-700"></div>
        </div>
      </div>
      <div className="mt-4 flex flex-row items-center justify-between gap-2">
        <button
          onClick={() => handleNetworkSwitch("ethereum")}
          className={`group flex-1 rounded-3xl border-0 ${
            activeButton === "ethereum" ? "bg-[#024365]" : "bg-[#FFEEDC]"
          } flex h-[80px] w-[80px] flex-col items-center justify-center px-4 py-4 sm:h-12 sm:w-auto sm:flex-row sm:px-6 sm:py-2`}
        >
          <Image
            src="/images/gara-coin/ethereum.png"
            alt="Ethereum"
            width={24}
            height={24}
            className="mb-1 sm:mb-0 sm:mr-2"
          />
          <span
            className={`font-black ${
              activeButton === "ethereum" ? "text-white" : "text-black"
            } text-[10px] sm:text-base`}
          >
            <span className="hidden sm:inline">Ethereum</span>
            <span className="inline text-2xl sm:hidden">ETH</span>
          </span>
        </button>

        <button
          onClick={() => handleNetworkSwitch("polygon")}
          className={`group flex-1 rounded-3xl border-0 ${
            activeButton === "polygon" ? "bg-[#024365]" : "bg-[#FFEEDC]"
          } flex h-[80px] w-[80px] flex-col items-center justify-center px-4 py-4 sm:h-12 sm:w-auto sm:flex-row sm:px-6 sm:py-2`}
        >
          <Image
            src="/images/gara-coin/polygon.png"
            alt="Polygon"
            width={24}
            height={24}
            className="mb-1 sm:mb-0 sm:mr-2"
          />
          <span
            className={`font-black ${
              activeButton === "polygon" ? "text-white" : "text-black"
            } text-[10px] sm:text-base`}
          >
            <span className="hidden sm:inline">Polygon</span>
            <span className="inline text-2xl sm:hidden">POL</span>
          </span>
        </button>

        <button
          onClick={() => handleNetworkSwitch("bsc")}
          className={`group flex-1 rounded-3xl border-0 ${
            activeButton === "bsc" ? "bg-[#024365]" : "bg-[#FFEEDC]"
          } flex h-[80px] w-[80px] flex-col items-center justify-center px-4 py-4 sm:h-12 sm:w-auto sm:flex-row sm:px-6 sm:py-2`}
        >
          <Image
            src="/images/gara-coin/bsc.png"
            alt="BSC"
            width={24}
            height={24}
            className="mb-1 sm:mb-0 sm:mr-2"
          />
          <span
            className={`font-black ${activeButton === "bsc" ? "text-white" : "text-black"} text-[10px] sm:text-base`}
          >
            <span className="hidden sm:inline">BSC</span>
            <span className="inline text-2xl sm:hidden">BSC</span>
          </span>
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full mb-4">
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="flex flex-col relative">
            <p className="font-black">Pay with eth</p>
            <CoinInput
              coin="USDC"
              type="number"
              placeholder="0.000"
              {...register("amount", { required: "Amount is required" })}
              showIcon={false}  // Disable icon, show CurrencySelect instead
              className="w-full"
            />
            <div className="absolute -right-2 top-2/3 transform -translate-y-1/2">
              <CurrencySelect name="token" form={form} currentNetworkId={currentNetworkId} />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-black">Receive $GARA</p>
            <CoinInput
              coin="GARA"
              type="text"
              placeholder="0.000"
              className="cursor-disabled pointer-events-none w-full"
              {...register("garaEstimate")}
              readOnly
            />
          </div>
        </div>
        {hasLowerInputBalance && (
              <p className="mt-2 pl-4 text-sm text-red-500">
                Amount must be greater than {minTokenBalance} {token}
              </p>
            )}
            {hasUnsufficientBalance && (
              <p className="mt-2 pl-4 text-sm text-red-500">Insufficient balance</p>
            )}
        <input type="hidden" {...register("from")} />
        <input type="hidden" {...register("to")} />
        <input type="hidden" name="chain" value={chain?.name} />
        <div className="mt-4 grid grid-cols-5 gap-2">
          {[50, 100, 500, 1000, 5000].map((value) => (
            <button
              key={value}
              className="group flex flex-1 items-center justify-center rounded-full border-0 bg-[#FFEEDC] p-2 font-black hover:bg-[#024365] hover:text-white"
              onClick={(e) => {
                e.preventDefault()
                setAmountValue(value.toString())
              }}
            >
              {`$${value}`}
            </button>
          ))}
        </div>
        <div className={cn("mt-6 gap-4", address ? "flex flex-col" : "flex flex-col lg:flex-row")}>
          <div className={cn("flex-1", !address && "hidden")}>
            <Button
              type="submit"
              variant={address ? "default" : "outlinePrimary"}
              disabled={!address || hasUnsufficientBalance || hasLowerInputBalance || isCalculatingMinBalance}
              className="h-12 w-full rounded-full bg-[#061022] text-center text-xl font-bold text-[#FFAE17]"
            >
              {t("btnBuyGARA")}
            </Button>
          </div>
          <div className="flex-1">
            <ConnectButton
              label={t("btnConnectWallet")}
              showBalance={false}
              className="h-12 w-full rounded-full bg-[#FF4473] text-center text-xl font-bold text-white"
            />
          </div>
        </div>
        {/*
        <button
          type="button" 
          onClick={getRefferalLink}
          className="w-full text-gary-pink pt-6 px-6 rounded-full font-semibold"
        >
          + GET REFERRAL LINK
        </button>
        */}
        {showPopup && <ReferralPopup onClose={() => setShowPopup(false)} />}
        <TransactionStatusModal
          open={open}
          toggleOpen={handleOnOpenChange}
          setOpen={setOpen}
          senderChainTxUrl={chainTxUrl}
        />
      </form>
      <div className="absolute -bottom-[calc(50%+32px)] right-0 z-10 w-full h-full pointer-events-none">
        <Image src="/images/ice_buy_gara.svg" fill alt="Ice Background" className="object-contain" />
      </div>
    </section> 
  )
}