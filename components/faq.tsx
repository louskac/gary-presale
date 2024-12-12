"use client"

import { Heading } from "@/components/heading"
import { useState } from "react"
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react"

const faqData = [
  {
    title: "What is $GARA coin?",
    text: "$GARA coin is a meme and utility token of the fast growing Coingarage exchange and has many uses. From paying a range of fees, to using the exchange's services and products, to fueling a trading bot, new uses will continue to emerge as the exchange's ecosystem grows.",
  },
  {
    title: "$GARA Coin Burning Mechanism",
    text: "In order to more smoothly evolve the value of the $GARA coin, a burning mechanism has been implemented that will gradually burn $GARA coins based on their increasing usage until only 200,000,000 of the original 900,000,000 remain.",
  },
  {
    title: "Tokenomics",
    text: "11% Stake rewards<br>21% Reserved for public pre-sale<br>10% Angel investors<br>11% company reserves<br>11% liquidity<br>11% founding team<br>10% for marketing use<br>15% to be burned if requirements are met",
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
  const [activeIndex, setActiveIndex] = useState<number | null>(0) // Default to the first FAQ item being open
  const [copied, setCopied] = useState(false)

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const handleCopyClick = (address: string) => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((error) => {
        console.error("Failed to copy text:", error)
      })
  }

  return (
    <div className="container mx-auto mt-20 flex flex-col items-center justify-center">
      <Heading className="text-left text-6xl font-bold leading-none tracking-normal">FAQ</Heading>
      <div className="mb-20 mt-16 flex flex-col gap-10">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="mx-auto flex w-full flex-col rounded-3xl bg-[#0D1E35] px-6 py-8 lg:w-3/5 lg:px-16 lg:py-12"
          >
            <div className="flex items-center justify-between">
              <Heading className="text-left text-2xl font-bold" stroke={false}>
                {faq.title}
              </Heading>
              <button onClick={() => toggleFaq(index)} className="text-white focus:outline-none">
                {activeIndex === index ? <ChevronUp size={32} /> : <ChevronDown size={32} />}
              </button>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                activeIndex === index ? "mt-4 max-h-screen" : "max-h-0"
              }`}
            >
              <p className="text-left text-xl font-bold text-white" dangerouslySetInnerHTML={{ __html: faq.text }}></p>
              {faq.hasCopyButton && faq.contractAddress && (
                <div className="mt-4 flex items-center justify-between rounded-lg bg-[#1B2D4F] p-4">
                  <span className="text-white">Contract Address:</span>
                  <span className="text-gary-yellow">{faq.contractAddress}</span>
                  <button
                    onClick={() => handleCopyClick(faq.contractAddress)}
                    className="ml-2 font-bold text-gary-yellow hover:text-white"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
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
