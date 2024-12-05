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
    <main className="h-screen overflow-y-scroll">
      <section id="home" className="relative flex min-h-screen w-full flex-col items-center justify-start">
        <NavBar />
        <Image src={backgroundSrc} alt="" className="-z-10 object-cover" priority quality={100} fill />
        <div className="flex h-full w-full flex-1 flex-col px-4 sm:px-6">
          <SaveGary />
        </div>

        {/* Add GarySection */}
        <GarySection />

        <div className="z-1 mt-0 flex w-full flex-row justify-center sm:mt-6">
          <ScrollToComicsButton />
        </div>
      </section>

      <div className="relative z-10 -mb-12 -mt-16 h-32 w-full px-4 sm:h-48 sm:px-6">
        <Image src="/backgrounds/gradient.png" alt="" fill className="hidden object-cover lg:block" />
      </div>
      <section id="about" className="relative -mt-20 h-screen w-full md:snap-y md:snap-mandatory">
        <GarysStoryCarousel />
      </section>
      <section id="help-gary" className="bg-background px-4 py-12 sm:px-6 sm:pb-24">
        <HelpGary />
      </section>
      <section id="earn" className="relative flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-24">
        <Image src={`/backgrounds/2.jpg`} alt="" className="-z-10 object-cover" fill />
        <EarnWithGary />
      </section>
      <div className="relative -mb-12 -mt-8 h-40 w-full sm:-mb-16 sm:-mt-10 sm:h-60">
        <Image src={`/backgrounds/ice.svg`} alt="" className="object-cover" fill />
      </div>
      <section id="tokenomics" className="mt-24">
        <Roadmap></Roadmap>
      </section>
      <section id="roadmap"></section>
      <section className="-mt-32 flex bg-background px-4 sm:-mt-44 sm:px-6">
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
