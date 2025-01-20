"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { SaveGary } from "@/components/save-gary"
import { Button } from "@/components/ui/button"
import { BuyGara } from "@/components/buy-gara-widget/widget"
import VideoPlayer from "@/components/video"

const Hero: React.FC = () => {
  const [backgroundSrc, setBackgroundSrc] = useState("/backgrounds/0.jpg")

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches
      setBackgroundSrc(isMobile ? "/backgrounds/mobile.png" : "/backgrounds/0.jpg")
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <section id="home" className="relative flex min-h-screen w-full flex-col items-center justify-start">
      <Image src={backgroundSrc} alt="" className="-z-10 object-cover" priority quality={100} fill />
      <div className="mt-16 flex flex-col items-center justify-center sm:mt-20 lg:mt-32">
        <SaveGary />
        <div className="flex lg:hidden">
          <Button className="mr-2 flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow">
            <a href="https://x.com/Help_Gary_" target="_blank" rel="noopener noreferrer">
              <Image src={`/images/save-penguins/twitter.svg`} width={32} height={32} alt="Twitter" className="scale-[2]" />
            </a>
          </Button>
          <Button className="mr-2 flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow">
            <a href="https://www.facebook.com/profile.php?id=61568221981440" target="_blank" rel="noopener noreferrer">
              <Image src={`/images/save-penguins/facebook.svg`} width={32} height={32} alt="Facebook" className="scale-[3]" />
            </a>
          </Button>
          <Button className="flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow">
            <a href="https://t.me/helpgary" target="_blank" rel="noopener noreferrer">
              <Image src={`/images/save-penguins/telegram.svg`} width={32} height={32} alt="Telegram" className="scale-[2.5]" />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-10 flex h-full w-full flex-col items-center justify-between px-4 lg:mt-16 lg:flex-row lg:items-start lg:px-40">
        {/* Video Section */}
        <div className="mb-8 flex w-full lg:w-[65%] flex-col items-center justify-start lg:mb-0">
          <div className="relative flex w-full aspect-[16/9] items-center justify-center rounded-2xl bg-black shadow-lg">
            <VideoPlayer />
          </div>
        </div>

        {/* Widget Section */}
        <div className="flex w-full lg:w-[35%] flex-col items-end justify-start relative">
          <div className="relative w-full px-0 sm:px-2">
            <BuyGara hideHeader />
            {/* Ice Background aligned perfectly */}
            <div className="absolute -bottom-6 right-0 z-[9990] h-[140px] w-full lg:w-[calc(100%-120px)]">
              <Image src="/images/ice_buy_gara.svg" fill alt="Ice Background" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
