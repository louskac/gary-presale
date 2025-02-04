"use client"

import { FC } from "react"
import Image from "next/image"
import { Heading } from "@/components/heading"

interface Feature {
  title: string
  description: string
}

const features: Feature[] = [
  {
    title: "Utility-Backed Growth",
    description:
      "$GARA has real use cases on the European exchange Coingarage as payment for fees and platform features.",
  },
  {
    title: "Fuel for tranging bot",
    description:
      "Coingarage’s trading bot makes 20–100 trades per user daily and consumes  $GARA for every trade increasing demand.",
  },
  {
    title: "Ongoing GARA Burning",
    description:
      "Every month, 20% of $GARA from fees is burned until only 200M remain from the original 900M.",
  },
]

const UtilityFeatures: FC = () => {
  return (
    <section className="relative py-20 mt-96">
      <div className="absolute -top-96 right-80 bg-gary-yellow text-black text-center px-4 py-2 text-lg font-thin rounded-lg z-10 animate-pop">
        <span className="text-5xl font-black">100x</span><br />potential
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[88%] w-[1200px] h-auto -z-10">
        <Image
          src="/images/trade.webp"
          alt="Trading Background"
          width={1200}
          height={600}
          className="object-cover"
        />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-6 text-white">
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 relative">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start rounded-3xl bg-[#0D1E35] p-8 text-left">
              <Heading className="mb-4 text-2xl font-bold text-gary-yellow">{feature.title}</Heading>
              <p className="text-lg text-white">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UtilityFeatures
