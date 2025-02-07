import { Heading } from "@/components/heading"
import { GarysRoadmap } from "@/components/garys-roadmap"
import Image from "next/image"
import { useState } from "react"
import { Copy, Check } from "lucide-react"

export const HelpGary = () => {
  const [copied, setCopied] = useState(false)

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText("0x0b258a4ecc4ac7a15fedb882db5d13f6ef23b02f")
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
      <div className="container mx-auto mt-10 flex flex-col items-center px-4 lg:mt-20">
        <Heading className="text-center text-3xl font-bold sm:text-6xl sm:text-[3.5rem]">
          Help Gary reach his goals
        </Heading>
        <div className="my-6 w-full max-w-[420px] overflow-hidden rounded-[30px] bg-[#0D1E35] p-4 text-center lg:max-w-[40%]">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="flex items-center justify-between">
              <p className="mr-2 font-bold text-gary-yellow">$GARA Contract</p>
              <button
                onClick={handleCopyClick}
                className="font-bold text-gary-yellow hover:text-white"
                aria-label="Copy address"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <p className="mt-2 max-w-full overflow-hidden text-ellipsis font-normal text-white">
              <a
                href="https://polygonscan.com/token/0x0b258a4ecc4ac7a15fedb882db5d13f6ef23b02f"
                target="_blank"
                rel="noopener noreferrer"
              >
                0x0b258a4ecc4ac7a15fedb882db5d13f6ef23b02f
              </a>
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <p className="font-bold text-gary-yellow">$GARA Contract</p>
            <p className="max-w-full overflow-hidden text-ellipsis font-normal text-white lg:ml-2">
              <a
                href="https://polygonscan.com/token/0x0b258a4ecc4ac7a15fedb882db5d13f6ef23b02f"
                target="_blank"
                rel="noopener noreferrer"
              >
                0x0b258a4ecc4ac7a15fedb882db5d13f6ef23b02f
              </a>
            </p>
            <button
              onClick={handleCopyClick}
              className="ml-2 font-bold text-gary-yellow hover:text-white"
              aria-label="Copy address"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto grid justify-center px-4">
        <div className="w-full">
          <GarysRoadmap />
        </div>
      </div>
    </div>
  )
}