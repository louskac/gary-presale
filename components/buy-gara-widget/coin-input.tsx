"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { CurrencySelect } from "./currency-select"

export const CoinInput = forwardRef<
  HTMLInputElement,
  {
    name: string
    coin: string
    placeholder?: string
    type: string
    readOnly?: boolean
    className?: string
    showIcon?: boolean
    form?: any
  } & React.InputHTMLAttributes<HTMLInputElement>
>(({ coin, className, showIcon = true, form, error, ...rest }, ref) => {
  const formatToLocale = (value: string | number | undefined) => {
    if (value === undefined) return ""
    return new Intl.NumberFormat("en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(Number(value))
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex w-full items-center gap-3 rounded-full border border-gray-300 bg-gary-input-blue/40 px-4 py-3 shadow-sm sm:gap-4 sm:px-6"
        )}
      >
        <input
          ref={ref}
          lang="en"
          min="0"
          step="0.0001"
          className={cn(
            "flex-grow appearance-none bg-transparent text-base font-medium text-gray-800 placeholder-gray-400 outline-none sm:text-lg",
            className
          )}
          onChange={(e) => {
            const formattedValue = formatToLocale(e.target.value)
            e.target.value = formattedValue
          }}
          {...rest}
        />
        {showIcon && (
          <div className="flex items-center gap-2">
            <Image src={`/icons/coins/${coin?.toLowerCase()}.png`} alt={coin} width={42} height={42} />
          </div>
        )}
        {form && <CurrencySelect form={form} />}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  )
})
