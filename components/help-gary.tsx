import { Heading } from "@/components/heading";
import { GarysRoadmap } from "@/components/garys-roadmap";
import { BuyGara } from "@/components/buy-gara-widget/widget";
import Image from "next/image";
import { useState } from "react"
import { Copy, Check } from "lucide-react"

export const HelpGary = () => {
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
    <div className="flex flex-col justify-center">
      <div className="container mx-auto mt-20 flex flex-col items-center lg:mt-44">
        <Heading className="text-center tetx-3xl sm:text-6xl font-bold sm:text-[3.5rem]">
          Help Gary reach his goals
        </Heading>
        <Heading className="mt-10 text-center uppercase text-gary-light-blue text-2xl">
          1 GARA sold = 1 vote
        </Heading>
        <div className="lg:flex my-6 rounded-[30px] p-4 px-6 bg-[#0D1E35] overflow-hidden text-center">
          <p className="font-bold text-gary-yellow">GARA Contract</p>
          <p className="overflow-x-auto truncate whitespace-nowrap font-normal text-white lg:ml-2">
            <a href="https://polygonscan.com/token/0x0b258a4ecc4ac7a15fedb882db5d13f6ef23b02f" target="_blank" rel="noopener noreferrer">
              0x0b258a4ecc4ac7a15fedb882db5d13f6ef23b02f
            </a>
          </p>
          <button
            onClick={handleCopyClick}
            className="mt-2 font-bold text-gary-yellow hover:text-white lg:ml-2 lg:mt-0 pl-4"
            aria-label="Copy address"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>
d
      {/* Adjusting order for mobile */}
      <div className="container mx-auto grid justify-center gap-8 lg:grid-cols-[1fr_auto] lg:justify-between">
        {/* Widget First on Mobile */}
        <div className="order-1 lg:order-2 mt-0">
          <div className="sticky top-0">
            <BuyGara />
            {/* monda */}
            {/* Ice Image */}
            <div className="absolute -bottom-[7.5rem] -left-3 h-[160px] w-[106%] hidden lg:block">
              <Image src="/images/ice_buy_gara.svg" fill alt="Ice Background" />
            </div>

            {/* Gary Image */}
            <div className="absolute -left-[150px] top-0 -z-10 hidden lg:block h-[363px] w-[324px]">
              <Image
                src="/images/help-gary/gary_buy_gara.png"
                fill
                alt="Gary Buy GARA"
              />
            </div>
          </div>
        </div>

        {/* Roadmap Second on Mobile */}
        <div className="order-2 lg:order-1">
          <GarysRoadmap />
        </div>
      </div>
    </div>
  );
};
