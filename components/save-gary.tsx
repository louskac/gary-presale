"use client"
import CountdownTimer from "@/components/countdown-timer"
import { Heading } from "@/components/heading"
import { ArrowDown } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Copy, Check } from "lucide-react"

export const SaveGary = () => {
  const [copied, setCopied] = useState(false)

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText("0x3027691e9Fe28499DAB102e591a6BA9cc40d0Ead")
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((error) => {
        console.error("Failed to copy text:", error)
      })
  }

  return (
    <div className="relative mb-8 mt-5 flex h-full flex-1 flex-col items-center justify-center gap-8">
      <div>
        <Heading className="text-center text-4xl font-bold leading-none tracking-normal lg:text-6xl">
          Save penguin Gary
        </Heading>
        <p className="mt-4 text-center text-xl font-bold text-gary-blue lg:text-2xl">
          The cutest and most determined penguin in the crypto world
        </p>
      </div>

      {/* <p className="font-bold text-gary-yellow">
    Contract presale: <span className="font-normal text-white">0x8ecE1A114ae4768545211Ec3f5Bb62987165cd79</span>
  </p> */}
      <div className="mt-6 hidden sm:block">
        <p className="mb-4 text-center text-xl font-bold text-gary-blue lg:text-2xl">
          Gary doesn&apos;t have much time left
        </p>
        <CountdownTimer />
      </div>
    </div>
  )
}
