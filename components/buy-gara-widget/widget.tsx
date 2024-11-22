"use client"

import { useEffect, useState } from "react"
import { isAddress } from "viem"
// @ts-ignore
import { useAccount, useBalance, useSendTransaction, useWalletClient, useWriteContract } from "wagmi"
// @ts-ignore
import { useAddRecentTransaction, useChainModal } from "@rainbow-me/rainbowkit"
import { ConnectButton } from "@/components/buy-gara-widget/connect-button"
import { z } from "zod"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import Image from "next/image"

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
import { Rounds } from "@/components/rounds"

// const COINGARAGE_CONTRACT_ADDRESS = "0xA4AC096554f900d2F5AafcB9671FA84c55cA3bE1" as `0x${string}`
const COINGARAGE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_COINGARAGE_ADDRESS as `0x${string}`
const TOKENS_SOLD = 647149

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

export function BuyGara({ className }: { className?: string }) {
  const t = useTranslations("GARA.main.buyGARA")
  const {
    transactionStatus,
    setTransactionStatus,
    setOutcomingTransaction,
    setIncomingTransaction,
    reset: resetState,
  } = useGaraStore((state) => state)
  const { data, isLoading, error } = useQuery({
    queryKey: ["ethereumPrice"],
    queryFn: async () => {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
      const data = await response.json()
      return data
    },
  })
  const eth_usd = data?.ethereum?.usd

  const [open, setOpen] = useState(false)
  const [hasUnsufficientBalance, setHasUnsufficientBalance] = useState(false)
  const toggleOpen = () => setOpen(!open)
  const handleOnOpenChange = () => {
    setOpen(!open)
    resetState()
  }
  const { address, chain } = useAccount()
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
      amount: "10.000",
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

  useEffect(() => {
    if (!address || !token || !chain) return
    if (token === "ETH") {
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
          // console.log(balance)
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
  }, [amount, address, balance, token, chain])

  useEffect(() => {
    const garaEstimate = getGaraEstimate(
      token,
      Number(amount),
      !["USDT", "USDC"].includes(eth_usd) ? eth_usd : undefined
    )
    setValue(
      "garaEstimate",
      garaEstimate.toLocaleString(undefined, {
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
  }, [chain])

  useEffect(() => {
    if (token === "ETH" && chain?.name !== "Ethereum") {
      if (typeof openChainModal === "function") {
        openChainModal()
      }
    }
  }, [token, chain, openChainModal])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { amount, token } = data
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
    const garaTransactionResponse = await fetch("/api/gara/exchange", {
      method: "POST",
      body: JSON.stringify({
        txHash: response.txHash,
        from: address,
        to: to,
        amount,
        chain: chain?.name,
        token,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const responseData = await garaTransactionResponse.json()
    console.log("GARA Transaction Response:", responseData)
    if (!garaTransactionResponse.ok) {
      setTransactionStatus({
        process: "receivePayment",
        status: "transactionError",
      })
      setIncomingTransaction({ done: true, error: responseData.message })
      return
    }
    addRecentTransaction({
      hash: responseData?.txHash,
      description: "Incoming GARA",
    })
    setIncomingTransaction({
      done: true,
      txHash: responseData?.txHash,
      // receipt: responseData?.status,
    })
    setTransactionStatus({ process: "receivePayment", status: "paymentSent" })
    reset()
  }

  return (
    <section
      id="buy-gara"
      className={cn(
        "relative mt-4 w-full max-w-full flex-1 rounded-t-2xl bg-gradient-to-b from-white to-[#CFEFFF] p-6 px-5 shadow-md",
        className
      )}
    >
      <h3 className="mb-6 text-center font-heading text-4xl font-bold text-gary-blue">{t("header")}</h3>
      <Table className="text-base">
        <TableBody className="text-base">
          <TableRow className="!border-none hover:bg-transparent">
            <TableCell className="max-w-[80px] !p-1 font-heading font-bold">{t("totalTokens")}</TableCell>
            <TableCell className="!p-1 text-end font-bold text-gary-pink">900M GARA</TableCell>
          </TableRow>
          <TableRow className="!border-none hover:bg-transparent">
            <TableCell className="!p-1 font-bold">{t("distributedTokens")}</TableCell>
            <TableCell className="!p-1 text-end font-bold text-gary-pink">99M GARA</TableCell>
          </TableRow>
          <TableRow className="!border-none hover:bg-transparent">
            <TableCell className="!p-1 font-bold">{t("soldTokens")}</TableCell>
            <TableCell className="!p-1 text-end font-bold text-gary-pink" suppressHydrationWarning>
              {formatAmount(TOKENS_SOLD, 0)} GARA
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="mt-4 grid grid-cols-[1fr_180px_1fr] gap-2">
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black dark:bg-neutral-700"></div>
        </div>
        <p className="text-center font-heading font-bold">
          Time Left - 1<sup>st</sup> round
        </p>
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black dark:bg-neutral-700"></div>
        </div>
      </div>
      <div className="my-4 flex flex-row justify-center">
        <CountdownTimer />
      </div>
      <div className="mt-8 grid grid-cols-[1fr_120px_1fr] gap-2">
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black dark:bg-neutral-700"></div>
        </div>
        <p className="text-center font-heading font-bold">Rounds</p>
        <div className="relative flex w-full flex-row items-center justify-center">
          <div className="h-[2px] w-full bg-black dark:bg-neutral-700"></div>
        </div>
      </div>
      <Rounds />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full">
        <div className="mt-4 grid w-full grid-cols-2 gap-2 md:grid-cols-[1fr_150px]">
          <CoinInput
            coin="USDC"
            type="number"
            placeholder="0.000"
            {...register("amount")}
            error={errors?.["amount"]?.message}
            showIcon={false}
          />
          <CurrencySelect name="token" form={form} />
        </div>
        <div className="mt-4">
          <CoinInput
            coin="GARA"
            type="text"
            placeholder="0.000"
            className="cursor-disabled pointer-events-none"
            {...register("garaEstimate")}
            readOnly
          />
        </div>
        <input type="hidden" {...register("from")} />
        <input type="hidden" {...register("to")} />
        <input type="hidden" name="chain" value={chain?.name} />

        <div className="mt-8 flex flex-col gap-4">
          <ConnectButton label={t("btnConnectWallet")} showBalance={false} />
          <Button
            type="submit"
            variant={address ? "default" : "outlinePrimary"}
            disabled={!address || hasUnsufficientBalance}
            className="h-12 rounded-full bg-[#061022] text-xl font-bold text-[#FFAE17]"
          >
            {t("btnBuyGARA")}
          </Button>
        </div>
        <TransactionStatusModal
          open={open}
          toggleOpen={handleOnOpenChange}
          setOpen={setOpen}
          senderChainTxUrl={chainTxUrl}
        />
      </form>
      {/*
      <div className="mt-6 flex flex-row justify-between gap-2 px-4 font-bold">
        <Button variant="link" size="sm" className="p-0 font-bold text-foreground" asChild>
          <a
            href="https://trade.coingarage.io/exchange/GARA-EUR"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center"
          >
            {t("buyWith")}
            <span className="mx-2 inline-flex">
              <Image src="/icons/coins/eur.png" width="18" height="18" alt="EUR" />
            </span>
            EUR
          </a>
        </Button>
        <div className="flex items-center justify-center">
        </div>
        <Button variant="link" className="p-0 font-bold">
          <a href="https://trade.coingarage.io/exchange/GARA-EUR" target="_blank" rel="noreferrer noopener">
            {t("linkGoToLaunchapad")}
          </a>
        </Button>
      </div>
      */}
      <p className="my-4 flex items-center justify-center space-x-2">
        <span className="text-xl leading-none">{t("poweredBy")}</span>
        <span className="inline-flex items-center">
          <Image src={Polygon} alt="Polygon" width={80} height={40} />
        </span>
      </p>
    </section>
  )
}
