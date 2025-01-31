"use client"

import { FC } from "react"
import Image from "next/image"
import { Heading } from "@/components/heading"

interface Feature {
  title: string
  description: string
  image: string
}

const features: Feature[] = [
  {
    title: "Seamless Trading Experience",
    description:
      "Our platform offers instant trades with low fees using $GARA. Unlock premium features and maximize your trading efficiency effortlessly.",
    image: "/utility/1.webp",
  },
  {
    title: "Rewards for Staking",
    description:
      "Stake your $GARA tokens and earn up to 30% annual rewards. The longer you hold, the more you benefit as the ecosystem grows.",
    image: "/utility/2.webp",
  },
  {
    title: "Decentralized Governance",
    description:
      "Participate in decision-making and vote on key updates. As a $GARA holder, you help shape the future of Coingarage and its ecosystem.",
    image: "/utility/3.webp",
  },
]

const UtilityFeatures: FC = () => {
  return (
    <section className="py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 text-white">
        <Heading className="text-center text-5xl font-bold text-gary-yellow">Explore $GARA Utilities</Heading>
        <p className="mt-4 text-center text-lg">
          Unlock the potential of $GARA with real-world use cases designed to create sustainable growth.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center rounded-3xl bg-[#0D1E35] p-8 text-center">
              <Image src={feature.image} alt={feature.title} width={120} height={120} className="mb-6" />
              <Heading className="mb-2 text-2xl font-bold text-gary-yellow">{feature.title}</Heading>
              <p className="text-lg text-white">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UtilityFeatures
