"use client"
import React from "react"
import { Heading } from "@/components/heading"
import { Button } from "./ui/button"
import Image from "next/image"

export const EarnWithGary = () => {
  const handleClick = (url: string) => {
    window.open(url, "_blank")
  }
  return (
    <div className="container mx-auto flex flex-col items-center justify-normal px-6">
      <div className="flex flex-col items-center gap-6">
        <Heading className="text-center text-3xl sm:text-6xl font-bold">Earn with Gary</Heading>
        <p className="my-5 text-center text-xl sm:text-4xl font-bold text-gary-blue">
          Stake your GARA coins and earn up to{" "}
          <span
            className="inline text-2xl sm:text-5xl text-[#19FB9B] ml-2"
            style={{
              WebkitTextStroke: "12px hsl(var(--gary-blue))",
              textStroke: "12px hsl(var(--gary-blue))",
              paintOrder: "stroke fill",
            }}
          >
            35% p.a.
          </span>
        </p>
        <p className="max-w-[800px] text-center text-md sm:text-2xl font-bold text-gary-blue">
          Gary isn&apos;t just a cute penguin, but he&apos;s also smart and knows how to make the most money. Gary
          stakes his GARA coins on the{" "}
          <a href="https://coingarage.io/en" target="_blank" rel="noopener noreferrer">
            <span className="cursor-pointer text-gary-pink">Coingarage</span>{" "}
          </a>
          exchange with returns of up to 35% annually, and you can too!
        </p>
        <Button
          variant="default"
          size="lg"
          className="my-2 h-14 border-2 border-transparent bg-gary-pink px-10 text-2xl text-white shadow-md outline-none transition-all sm:hover:bg-white sm:hover:text-gary-pink sm:hover:border-gary-pink dark:sm:hover:bg-white dark:sm:hover:text-gary-pink"
          onClick={() => {
            handleClick("https://trade.coingarage.io/stake");
          }}
        >
          Stake plans
        </Button>
      </div>

      <div className="relative mt-56 hidden lg:mt-32 lg:flex">
        <Image
          src={`/images/earn-with-gary/money.png`}
          alt="Gary"
          width={262}
          height={258}
          className="object-contain"
        />
        <Image
          src={`/images/earn-with-gary/gary_teacher.png`}
          alt="Gary"
          width={248}
          height={324}
          className="absolute bottom-4 left-48 object-contain"
        />
        <Image
          src={`/images/earn-with-gary/table.png`}
          alt="Gary"
          width={377}
          height={260}
          className="ml-40 object-contain"
        />
      </div>
    </div>
  )
}
