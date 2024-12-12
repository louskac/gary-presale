import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatAmount = (amount: number = 0, fraction = 2) => {
  if (amount && typeof amount === "number") {
    if (amount > 1) {
      let value = +amount.toFixed(fraction)
      return value.toLocaleString("us", {
        minimumFractionDigits: fraction,
        maximumFractionDigits: fraction,
      })
    } else {
      let value = +amount.toFixed(4)
      return value.toLocaleString("us", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
    }
  }
  return "0.00"
}

export const formatCurrency = (amount: number = 0, fraction = 2) => {
  if (amount && typeof amount === "number") {
    if (amount > 1) {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: fraction,
        maximumFractionDigits: fraction,
      }).format(amount)
    } else if (amount > 0.0001) {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(amount)
    } else {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      }).format(amount)
    }
  }
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(0)
}

export const formatPercentage = (amount: number = 0) => {
  if (amount && typeof amount === "number") {
    let value = Number(amount) / 100
    return new Intl.NumberFormat("en", {
      style: "percent",
      unit: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }
  return "0.00%"
}

export const timeAgo = (timestamp: Date, locale: string = "en") => {
  let value
  const diff = (new Date().getTime() - timestamp.getTime()) / 1000
  const minutes = Math.floor(diff / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (years > 0) {
    value = rtf.format(0 - years, "year")
  } else if (months > 0) {
    value = rtf.format(0 - months, "month")
  } else if (days > 0) {
    value = rtf.format(0 - days, "day")
  } else if (hours > 0) {
    value = rtf.format(0 - hours, "hour")
  } else if (minutes > 0) {
    value = rtf.format(0 - minutes, "minute")
  } else {
    value = rtf.format(0 - diff, "second")
  }
  return value
}

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000).toFixed(2)
  return balance
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex)
  return chainIdNum
}

export const formatAddress = (addr: string | undefined, length: number | undefined = 12) => {
  return `${addr?.substring(0, 5)}...${addr?.substring(addr.length - length)}`
}

export const formatDateString = (date: string) => {
  if (!date) return ""
  if (typeof window === "undefined") return new Date(date).toLocaleDateString("en-US")
  return new Date(date).toLocaleDateString()
}
