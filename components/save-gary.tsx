"use client"
import CountdownTimer from "@/components/countdown-timer"
import { Heading } from "@/components/heading"
import { ArrowDown } from "lucide-react"
import Image from "next/image"

export const SaveGary = () => (
  <div className="relative mb-8 mt-5 flex h-full flex-1 flex-col items-center justify-center gap-8">
    <div>
      <Heading className="text-center text-6xl font-bold leading-none tracking-normal">
        Save penguin Gary
      </Heading>
      <p className="mt-4 text-center text-2xl font-bold text-gary-blue">
        The cutest and most determined penguin in the crypto world
      </p>
    </div>
    <div className="mt-6">
      <p className="mb-4 text-center text-2xl font-bold text-gary-blue">Gary doesn&apos;t have much time left</p>
      <CountdownTimer />
    </div>
  </div>
)
