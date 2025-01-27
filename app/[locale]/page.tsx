"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { NavBar } from "@/components/navbar"
import { HelpGary } from "@/components/help-gary"
import { EarnWithGary } from "@/components/earn-with-garry"
import { SavePenguins } from "@/components/save-penguins"
import { Faq } from "@/components/faq"
import { Footer } from "@/components/footer"
import GarySection from "@/components/clickable-gary"
import Roadmap from "@/components/roadmap"
import Tokenomics from "@/components/tokenomics"
import OurTeam from "@/components/our-team"
import MemeGenerator from "@/components/meme-generator"
import PartnersCarousel from "@/components/partners"
import Hero from "@/components/hero"
import Social from "@/components/social"

const partnersData = [
  {
    name: "CryptoMode",
    logo: "/logos/cryptomode.png",
    link: "https://cryptomode.com/altcoins/cryptocurrency-a-new-frontier-for-funding-global-ecological-solutions/"
  },
  {
    name: "CryptoPotato",
    logo: "/logos/cryptopotato.png",
    link: "https://cryptopotato.com/coingarage-bringing-the-most-crypto-utility-to-europe/"
  },
  {
    name: "CoinMarketCap",
    logo: "/logos/coinmarketcap.svg",
    link: "https://coinmarketcap.com/community/articles/6790d7c3d12de6198cb919df/"
  },
  {
    name: "CryptoDaily",
    logo: "/logos/cryptodaily.png",
    link: "https://cryptodaily.co.uk/2025/01/help-gary-token-pre-sale-a-unique-initiative-by-coingarage-exchange"
  },
  {
    name: "CoinPaper",
    logo: "/logos/coinpaper.svg",
    link: "https://coinpaper.com/6960/top-5-memecoins-for-2025-that-you-simply-can-t-miss"
  },
  {
    name: "Crypto News Flash",
    logo: "/logos/cryptonewsflash.png",
    link: "https://www.crypto-news-flash.com/memecoins-a-fun-dive-into-the-world-of-crypto/"
  },
  {
    name: "Coin gabbar",
    logo: "/logos/coingabbar.svg",
    link: "https://www.coingabbar.com/en/crypto-blogs-details/help-gary-crypto-project-gara-token-on-polygon-blockchain"
  },
  
]

const shouldShowSocialPosts = false;

const tweetIds = [
  '1871496395452203089',
  '1867227365010747577',
  '1867257564708450697',
  '1866885902196240545',
  '1866877871874101729',
]

export default function Home() {
  return (
    <main className="z-50 h-screen">
      <NavBar />
      <Hero />

      <section id="help-gary" className="bg-background sm:px-6 sm:pb-24">
        <PartnersCarousel partners={partnersData} />
      </section>

      <section id="gary-section" className="bg-background py-12 sm:px-6 sm:pb-24">
        <GarySection />
      </section>

      <section id="garys-goals" className="bg-background py-12 sm:px-6 sm:pb-24">
        <HelpGary />
      </section>

      <section id="earn" className="relative flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-24">
        <Image src={`/backgrounds/2.jpg`} alt="" className="-z-10" fill />
        <EarnWithGary />
      </section>
      <div className="relative -mb-12 -mt-8 h-40 w-full sm:-mb-16 sm:-mt-10 sm:h-60">
        <Image src="/backgrounds/ice.svg" alt="" className="object-cover" fill />
      </div>

      <section id="roadmap" className="mt-24 overflow-visible">
        <Roadmap />
      </section>
      <section id="tokenomics">
        <Tokenomics />
      </section>
      {/* This section is conditionally hidden */}
      {shouldShowSocialPosts && (
        <section id="social" className="my-28">
          <div className="container mx-auto px-4">
            {/* Social component is disabled */}
            {/* <Social tweetIds={tweetIds} /> */}
          </div>
        </section>
      )}
      <section id="ourteam" className="my-28">
        <OurTeam />
      </section>
      <section id="save" className="-mt-20 flex bg-background px-4 sm:-mt-44 sm:px-6">
        <SavePenguins />
      </section>
      <section id="faq" className="bg-background px-4 sm:px-6">
        <Faq />
      </section>
      <section id="footer" className="bg-[#0D1E35] px-4 sm:px-6">
        <Footer />
      </section>
    </main>
  )
}