"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { NavBar } from "@/components/navbar"
import { SaveGary } from "@/components/save-gary"
import { HelpGary } from "@/components/help-gary"
import { GarysStoryCarousel } from "@/components/garys-story/carousel"
import { EarnWithGary } from "@/components/earn-with-garry"
import { SavePenguins } from "@/components/save-penguins"
import { Faq } from "@/components/faq"
import { Footer } from "@/components/footer"
import { ScrollToComicsButton } from "@/components/scroll-to-comics-button"
import GarySection from "@/components/clickable-gary"
import Roadmap from "@/components/roadmap"
import Tokenomics from "@/components/tokenomics"
import OurTeam from "@/components/our-team"
import MemeGenerator from "@/components/meme-generator"
import { BuyGara } from "@/components/buy-gara-widget/widget"
import { Button } from "@/components/ui/button"
import VideoPlayer from "@/components/video"

export default function Home() {
  const [backgroundSrc, setBackgroundSrc] = useState("/backgrounds/0.jpg")

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches
      setBackgroundSrc(isMobile ? "/backgrounds/mobile.png" : "/backgrounds/0.jpg")
    }

    // Run on initial load
    handleResize()

    // Add event listener for resize
    window.addEventListener("resize", handleResize)

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <main className="z-50 h-screen">
      <section id="home" className="relative flex min-h-screen w-full flex-col items-center justify-start">
        <NavBar />

        <Image src={backgroundSrc} alt="" className="-z-10 object-cover" priority quality={100} fill />

        <div className="mt-16 flex flex-col items-center justify-center sm:mt-20 lg:mt-32">
          <SaveGary />
          <div className="flex lg:hidden">
            <Button className="mr-2 flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow">
              <a href="https://x.com/Help_Gary_" target="_blank" rel="noopener noreferrer">
                <Image
                  src={`/images/save-penguins/twitter.svg`}
                  width={32}
                  height={32}
                  alt="Twitter"
                  className="scale-[2]"
                />
              </a>
            </Button>
            <Button className="mr-2 flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow">
              <a
                href="https://www.facebook.com/profile.php?id=61568221981440"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`/images/save-penguins/facebook.svg`}
                  width={32}
                  height={32}
                  alt="Facebook"
                  className="scale-[3]"
                />
              </a>
            </Button>
            <Button className="flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow">
              <a href="https://t.me/helpgary" target="_blank" rel="noopener noreferrer">
                <Image
                  src={`/images/save-penguins/telegram.svg`}
                  width={32}
                  height={32}
                  alt="Telegram"
                  className="scale-[2.5]"
                />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-10 flex h-full w-full flex-col items-center justify-between px-4 lg:mt-16 lg:flex-row lg:items-start lg:px-40">
          <div className="mb-8 flex w-full flex-1 flex-col items-center justify-start lg:mb-0 lg:w-auto">
            <div className="relative flex w-full max-w-[926px] aspect-[16/9] items-center justify-center rounded-2xl bg-black shadow-lg">
              <VideoPlayer />
            </div>
            <div className="mt-4"></div>
          </div>

          <div className="flex w-full flex-1 flex-col items-end justify-start lg:w-[420px] lg:items-end">
            <div className="relative w-full px-0 sm:px-2">
              <BuyGara hideHeader />

              <div className="absolute -bottom-6 right-2 z-[9990] h-[140px] w-full lg:w-[420px]">
                <Image 
                  src="/images/ice_buy_gara.svg" 
                  fill 
                  alt="Ice Background" 
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 -mb-12 -mt-16 h-32 w-full px-4 sm:h-48 sm:px-6 blur-xl">
        <Image src="/backgrounds/gradient.png" alt="" fill className="hidden object-cover lg:block" />
      </div>

      <section id="help-gary" className="bg-background py-12 sm:px-6 sm:pb-24">
        <GarySection />
      </section>

      <section id="help-gary" className="bg-background py-12 sm:px-6 sm:pb-24">
        <HelpGary />
      </section>
      <div className="relative z-10 -mb-12 h-32 w-full px-4 sm:h-48 sm:px-6 blur-xl">
        <Image src="/backgrounds/gradient2.png" alt="" fill className="hidden object-cover lg:block" />
      </div>
      <section id="earn" className="relative flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-24">
        <Image src={`/backgrounds/2.jpg`} alt="" className="-z-10 object-cover" fill />
        <EarnWithGary />
      </section>
      <div className="relative -mb-12 -mt-8 h-40 w-full sm:-mb-16 sm:-mt-10 sm:h-60">
        <Image src={`/backgrounds/ice.svg`} alt="" className="object-cover" fill />
      </div>
      <section id="roadmap" className="mt-24 overflow-visible">
        <Roadmap />
      </section>
      <section id="tokenomics">
        <Tokenomics />
      </section>
      <section id="ourteam" className="my-28">
        <OurTeam />
      </section>
      <section className="-mt-20 flex bg-background px-4 sm:-mt-44 sm:px-6">
        <SavePenguins />
      </section>
      <section id="faq" className="bg-background px-4 sm:px-6">
        <Faq />
      </section>
      <section id="save" className="bg-[#0D1E35] px-4 sm:px-6">
        <Footer />
      </section>
    </main>
  )
}
