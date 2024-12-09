import React from "react"
import { Heading } from "./heading"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules"
import "swiper/css"

import { useState, useEffect } from "react"

const roadData = [
  {
    period: "2021-23",
    events: [
      { quarter: "2021 Q3", description: "Founding the company and forming the team." },
      {
        quarter: "2023 Q1",
        description:
          "Successful launch of Coingarage platform including FIAT/Crypto payment gateways. Creation of $GARA.",
      },
      { quarter: "2023 Q2", description: "Launch of mobile applications." },
      { quarter: "2023 Q4", description: "Listing of more than 100 coins on Coingarage exchange." },
    ],
  },
  {
    period: "2024",
    events: [
      { quarter: "Q1", description: "Launching trading app on Coingarage exchange." },
      { quarter: "Q3", description: "Stake $GARA Program with annual returns up to 35%." },
      { quarter: "Q4", description: "Start of the first round of $GARA Pre-sale." },
      { quarter: "Q4", description: "Launch of crypto academy on Coingarage platform." },
    ],
  },
  {
    period: "2025",
    events: [
      { quarter: "Q1", description: "Listing of $GARA for trading on the Coingarage exchange." },
      { quarter: "Q1", description: "Listing on Uniswap, CoinMarketCap, and CoinGecko." },
      { quarter: "Q2", description: "$GARA Airdrop and $GARA listing on other exchanges." },
      { quarter: "Q2", description: "Applying $GARA fees and burning $GARA." },
      { quarter: "Q3", description: "Application of $GARA as fuel for trading bots." },
      { quarter: "Q4", description: "Crypto payment card and cashback $GARA." },
    ],
  },
]

const Roadmap = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1147)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  return (
    <div className="roadmap relative m-auto">
      <Heading className="!mt-0 text-center text-6xl font-bold tracking-wider text-gary-yellow">$GARA Roadmap</Heading>

      <div className="absolute left-0 top-[126px] hidden h-2 w-[50%] bg-gary-light-blue lg:block"></div>
      <div className="absolute right-0 top-[126px] hidden h-2 w-[50%] bg-[#0D1E35] lg:block"></div>

      <div className="m-auto mt-10 w-[90%] lg:mt-36">
        {isMobile ? (
          <Swiper
            className="mySwiper flex justify-center"
            spaceBetween={70}
            slidesPerView="auto"
            centeredSlides={true}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            allowSlideNext={true}
            breakpoints={{
              1147: {
                slidesPerView: 3,
              },
            }}
          >
            {/* arrows */}
            <div className="swiper-button-next absolute right-1 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-black p-2 text-3xl text-white">
              &#8594;
            </div>
            <div className="swiper-button-prev absolute left-1 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-black p-2 text-3xl text-white">
              &#8592;
            </div>
            {roadData.map((section, index) => (
              <SwiperSlide
                key={index}
                className={`roadmap-section relative z-10 flex !h-[650px] !w-[90%] justify-center rounded-[30px] border-8 bg-[#0D1E35] px-10 pb-10 sm:!h-[400px] lg:mx-5 ${index != 2 ? "border-gary-light-blue" : "border-[#0D1E35]"}`}
              >
                <Heading stroke={false} className="mt-10 text-center text-4xl text-gary-yellow">
                  {section.period}
                </Heading>

                <ul>
                  {section.events.map((event, idx) => (
                    <li key={idx} className="mt-4 font-bold text-white lg:w-[241px]">
                      <strong className="text-[18px] text-gary-light-blue">{event.quarter}:</strong> {event.description}
                    </li>
                  ))}
                </ul>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="m-auto flex justify-center">
            {roadData.map((section, index) => (
              <div
                key={index}
                className={`roadmap-section relative mx-5 w-[350px] rounded-[30px] bg-[#0D1E35] px-10 lg:h-full lg:pb-10 ${index < 2 ? "border-8 border-solid border-gary-light-blue" : "border-8 border-solid border-transparent"}`}
              >
                <div
                  className={`absolute left-1/2 top-[-115px] flex h-16 w-16 -translate-x-1/2 transform items-center justify-center rounded-full border-8 border-solid ${index < 2 ? "border-gary-light-blue" : "border-[#0D1E35]"} bg-[#0D1E35]`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`lucide lucide-check ${index < 2 ? "text-[#FFAF1A]" : "text-[#0D1E35]"}`}
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <div
                    className={`absolute top-14 m-auto h-11 w-2 ${index < 2 ? "bg-gary-light-blue" : "bg-[#0D1E35]"}`}
                  ></div>
                </div>

                <Heading stroke={false} className="mt-10 text-center text-4xl text-gary-yellow">
                  {section.period}
                </Heading>

                <ul>
                  {section.events.map((event, idx) => (
                    <li key={idx} className="mt-4 w-[241px] font-bold text-white">
                      <strong className="text-[18px] text-gary-light-blue">{event.quarter}:</strong> {event.description}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default Roadmap
