"use client";

import { Heading } from "@/components/heading";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    title: "What is GARA coin?",
    text: "GARA coin is a meme and utility token of the fast growing Coingarage exchange and has many uses. From paying a range of fees, to using the exchange's services and products, to fueling a trading bot, new uses will continue to emerge as the exchange's ecosystem grows.",
  },
  {
    title: "GARA Coin Burning Mechanism",
    text: "In order to more smoothly evolve the value of the GARA coin, a burning mechanism has been implemented that will gradually burn GARA coins based on their increasing usage until only 200,000,000 of the original 900,000,000 remain.",
  },
  {
    title: "Tokenomics",
    text: "11% Stake rewards, 21% Reserved for public pre-sale, 10% Angel investors, 11% company reserves, 11% liquidity, 11% founding team, 10% for marketing use, 15% to be burned if requirements are met",
  },
];

export const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // Default to the first FAQ item being open

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto mt-40 flex flex-col items-center justify-center">
      <Heading className="text-left text-4xl font-bold leading-none tracking-normal">FAQ</Heading>
      <div className="mb-20 mt-16 flex flex-col gap-10">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="mx-auto flex w-full flex-col gap-4 rounded-3xl bg-[#0D1E35] px-6 py-8 lg:w-3/5 lg:px-16 lg:py-12"
          >
            <div className="flex items-center justify-between">
              <Heading className="text-2xl font-bold text-left">{faq.title}</Heading>
              <button
                onClick={() => toggleFaq(index)}
                className="text-white focus:outline-none"
              >
                {activeIndex === index ? <ChevronUp size={32} /> : <ChevronDown size={32} />}
              </button>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                activeIndex === index ? "max-h-screen" : "max-h-0"
              }`}
            >
              <p className="text-xl font-bold text-white text-left">
                {faq.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
