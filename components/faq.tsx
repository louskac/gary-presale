"use client"

import { Heading } from "@/components/heading"
import { useState } from "react"
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react"

const faqData = [
  {
    title: "What is $GARA coin?",
    text: "$GARA coin is a meme and utility token of the fast-growing Coingarage exchange and has many uses. From paying a range of fees, to using the exchange's services and products, to fueling a trading bot, new uses will continue to emerge as the exchange's ecosystem grows.",
  },
  {
    title: "$GARA Coin Burning Mechanism",
    text: "In order to more smoothly evolve the value of the $GARA coin, a burning mechanism has been implemented that will gradually burn $GARA coins based on their increasing usage until only 200,000,000 of the original 900,000,000 remain.",
  },
  {
    title: "How long after purchase will I receive my $GARA?",
    text: "$GARA is automatically and immediately transferred to the connected wallet after purchase. To display it in the list of crypto coins in your wallet, you need to add it as a new token.",
  },
  {
    title: "How do I add $GARA to my wallet?",
    text: "After connecting your wallet and the purchase of the $GARA token, you need to add a new token in your wallet for $GARA to appear in the list of your crypto coins. To add the $GARA token, use the contract address below:",
    hasCopyButton: true,
    contractAddress: "0x0b258a4ecc4ac7a15fedb882db5d13f6ef23b02f",
  },
]

export const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const [copied, setCopied] = useState(false)

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const handleCopyClick = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="container mx-auto mb-28 mt-28 px-4 lg:max-w-[1000px] lg:px-0">
      <Heading className="text-center text-3xl font-bold sm:text-5xl">FAQ</Heading>
      <div className="my-8 flex flex-col gap-6 lg:mt-12 lg:gap-8">
        {faqData.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleFaq(index)}
            className="flex cursor-pointer flex-col rounded-3xl bg-[#0D1E35] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
          >
            <div className="flex items-center justify-between">
              <Heading className="text-left text-xl font-bold sm:text-2xl">
                <span
                  style={{
                    WebkitTextStroke: "0px hsl(var(--gary-blue))",
                    paintOrder: "fill",
                  }}
                >
                  {faq.title}
                </span>
              </Heading>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFaq(index)
                }}
                className="text-white hover:text-gary-yellow focus:outline-none"
              >
                {activeIndex === index ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
              </button>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                activeIndex === index ? "mt-4 max-h-screen" : "max-h-0"
              }`}
            >
              <p
                className="text-md lg:font-black text-white sm:text-base"
                dangerouslySetInnerHTML={{ __html: faq.text }}
              ></p>
              {faq.hasCopyButton && faq.contractAddress && (
                <div className="mt-4 flex flex-col rounded-lg bg-[#1B2D4F] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-400 sm:text-sm">Contract Address:</p>
                  <span className="overflow-hidden truncate text-gary-yellow sm:ml-2 sm:text-base">
                    {faq.contractAddress}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation() // Prevent the parent's onClick from triggering
                      handleCopyClick(faq.contractAddress)
                    }}
                    className="mt-2 text-xs font-bold text-gary-yellow hover:text-white focus:outline-none sm:ml-4 sm:mt-0"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
