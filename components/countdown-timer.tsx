"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

const CountdownTimer = ({ className }: { className?: string }) => {
  const t = useTranslations("GARA.garaDepo.timer")

  // Initial token price
  const initialPrice = 0.12

  // State for time and price
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [price, setPrice] = useState<number>(initialPrice)

  useEffect(() => {
    // Load price from localStorage in the browser
    if (typeof window !== "undefined") {
      const savedPrice = localStorage.getItem("garaPrice")
      setPrice(savedPrice ? parseFloat(savedPrice) : initialPrice)
    }
  }, [])

  // Calculate the next Sunday midnight
  const getNextSundayMidnight = () => {
    const now = new Date()
    const nextSunday = new Date()
    nextSunday.setDate(now.getDate() + (7 - now.getDay())) // Days until Sunday
    nextSunday.setHours(0, 0, 0, 0) // Set time to midnight
    return nextSunday.getTime()
  }

  const calculateTimeLeft = () => {
    const now = new Date().getTime()
    const targetDate = getNextSundayMidnight()
    const difference = targetDate - now

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    setTimeLeft({ days, hours, minutes, seconds })

    // Reset the timer and increment price if timeLeft reaches 0
    if (difference <= 0) {
      handleReset()
    }
  }

  const handleReset = () => {
    // Increment the price by 0.01
    const newPrice = price + 0.01
    setPrice(newPrice)
    if (typeof window !== "undefined") {
      localStorage.setItem("garaPrice", newPrice.toFixed(2))
    }

    // Reset the timer to the next Sunday midnight
    calculateTimeLeft()
  }

  useEffect(() => {
    const timer = setInterval(() => calculateTimeLeft(), 1000)
    return () => clearInterval(timer)
  }, [price])

  return (
    <div className={cn("flex w-full items-center justify-center space-x-2", className)}>
      <div className="flex w-full flex-col items-center rounded-xl bg-gary-blue p-2 font-heading shadow-md">
        <div className="text-3xl font-bold text-gary-yellow">{String(timeLeft.days).padStart(2, "0")}</div>
        <div className="text-xs text-white">{t("day")}</div>
      </div>

      <div className="text-xl font-bold text-secondary">:</div>

      <div className="flex w-full flex-col items-center rounded-xl bg-gary-blue p-2 font-heading shadow-md">
        <div className="text-3xl font-bold text-gary-yellow">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="text-xs text-white">{t("hours")}</div>
      </div>

      <div className="text-xl font-bold text-secondary">:</div>

      <div className="flex w-full flex-col items-center rounded-xl bg-gary-blue p-2 font-heading shadow-md">
        <div className="text-3xl font-bold text-gary-yellow">{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div className="text-xs text-white">{t("minutes")}</div>
      </div>

      <div className="text-xl font-bold text-secondary">:</div>

      <div className="flex w-full flex-col items-center rounded-xl bg-gary-blue p-2 font-heading shadow-md">
        <div className="text-3xl font-bold text-gary-yellow">{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div className="text-xs text-white">{t("seconds")}</div>
      </div>
    </div>
  )
}

export default CountdownTimer
