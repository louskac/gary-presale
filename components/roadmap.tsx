import React from "react"
import { Heading } from "./heading"

const roadData = [
  {
    period: "2021-23",
    events: [
      { quarter: "2021 Q3", description: "Founding the company and forming the team." },
      {
        quarter: "2023 Q1",
        description:
          "Successful launch of Coingarage platform including FIAT/Crypto payment gateways. Creation of GARA.",
      },
      { quarter: "2023 Q2", description: "Launch of mobile applications." },
      { quarter: "2023 Q4", description: "Listing of more than 100 coins on Coingarage exchange." },
    ],
  },
  {
    period: "2024",
    events: [
      { quarter: "Q1", description: "Launching trading app on Coingarage exchange." },
      { quarter: "Q3", description: "Stake GARA Program with annual returns up to 35%." },
      { quarter: "Q4", description: "Start of the first round of GARA Pre-sale." },
      { quarter: "Q4", description: "Launch of crypto academy on Coingarage platform." },
    ],
  },
  {
    period: "2025",
    events: [
      { quarter: "Q1", description: "Listing of GARA for trading on the Coingarage exchange." },
      { quarter: "Q1", description: "Listing on Uniswap, CoinMarketCap, and CoinGecko." },
      { quarter: "Q2", description: "GARA Airdrop and GARA listing on other exchanges." },
      { quarter: "Q2", description: "Applying GARA fees and burning GARA." },
      { quarter: "Q3", description: "Application of GARA as fuel for trading bots." },
      { quarter: "Q4", description: "Crypto payment card and cashback GARA." },
    ],
  },
]

const Roadmap = () => {
  return (
    <div className="roadmap m-auto w-[90%]">
      <Heading className="!mt-0 text-center text-6xl font-bold tracking-wider text-gary-yellow">GARA Roadmap</Heading>
      <div className="m-auto mt-10 lg:flex lg:justify-center">
        {roadData.map((section, index) => (
          <div
            key={index}
            className="roadmap-section mx-5 w-[350px] rounded-[30px] bg-[#0D1E35] px-10 lg:h-full lg:pb-10"
          >
            <Heading stroke={false} className="mt-10 text-center text-4xl text-gary-yellow">
              {section.period}
            </Heading>
            <ul>
              {section.events.map((event, idx) => (
                <li key={idx} className="mt-4 w-[241] font-bold text-white">
                  <strong className="text-[18px] text-gary-light-blue">{event.quarter}:</strong> {event.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Roadmap
