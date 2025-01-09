"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NavBar } from "@/components/navbar";
import { SaveGary } from "@/components/save-gary";
import { HelpGary } from "@/components/help-gary";
import { GarysStoryCarousel } from "@/components/garys-story/carousel";
import { EarnWithGary } from "@/components/earn-with-garry";
import { SavePenguins } from "@/components/save-penguins";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { ScrollToComicsButton } from "@/components/scroll-to-comics-button";
import GarySection from "@/components/clickable-gary";
import Roadmap from "@/components/roadmap";
import Tokenomics from "@/components/tokenomics";
import OurTeam from "@/components/our-team";
import { BuyGara } from "@/components/buy-gara-widget/widget";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [backgroundSrc, setBackgroundSrc] = useState("/backgrounds/0.jpg");

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      setBackgroundSrc(isMobile ? "/backgrounds/mobile.png" : "/backgrounds/0.jpg");
    };

    // Run on initial load
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main className="z-50 h-screen">
      <section
        id="home"
        className="relative flex min-h-screen w-full flex-col items-center justify-start"
      >
        <NavBar />

        <Image
          src={backgroundSrc}
          alt=""
          className="-z-10 object-cover"
          priority
          quality={100}
          fill
        />

        <div className="flex flex-col items-center justify-center mt-16 sm:mt-20 lg:mt-32">
          <SaveGary />
          <div className="flex lg:hidden">
            <Button className="aspect-square h-[40px] w-[40px] rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow flex items-center justify-center mr-2">
              <a href="https://x.com/Help_Gary_" target="_blank" rel="noopener noreferrer">
                <Image src={`/images/save-penguins/twitter.svg`} width={32} height={32} alt="Twitter" className="scale-[2]" />
              </a>
            </Button>
            <Button className="aspect-square h-[40px] w-[40px] rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow flex items-center justify-center mr-2">
              <a
                href="https://www.facebook.com/profile.php?id=61568221981440"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src={`/images/save-penguins/facebook.svg`} width={32} height={32} alt="Facebook" className="scale-[3]" />
              </a>
            </Button>
            <Button className="aspect-square h-[40px] w-[40px] rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow flex items-center justify-center">
              <a href="https://t.me/helpgary" target="_blank" rel="noopener noreferrer">
                <Image src={`/images/save-penguins/telegram.svg`} width={32} height={32} alt="Telegram" className="scale-[2.5]" />
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full h-full mt-10 lg:mt-16 px-4 lg:px-20">
          <div className="flex flex-col items-center justify-start flex-1 w-full lg:w-auto mb-8 lg:mb-0">
            <div className="relative bg-gray-500 w-full max-w-[400px] sm:max-w-[600px] lg:max-w-[926px] h-[300px] sm:h-[400px] lg:h-[580px] rounded-2xl flex items-center justify-center shadow-lg">
              <button className="px-10 py-4 bg-[#061022BF] text-white font-bold rounded-full hover:bg-opacity-80 focus:outline-none">
                Watch my story
              </button>
            </div>

            <div className="mt-4">
              <Image
                src="/images/kyc_gold_badge.png"
                width={150}
                height={60}
                alt="KYC Gold Badge"
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start justify-start flex-1 w-full lg:w-[500px]">
            <div className="w-full px-0 sm:px-2 relative">
              <BuyGara hideHeader />
              <div className="hidden lg:block absolute -bottom-8 left-0 h-[140px] w-full z-[9990]">
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

      <div className="relative z-10 -mb-12 -mt-16 h-32 w-full px-4 sm:h-48 sm:px-6">
        <Image
          src="/backgrounds/gradient.png"
          alt=""
          fill
          className="hidden object-cover lg:block"
        />
      </div>

      <section
        id="help-gary"
        className="bg-background py-12 sm:px-6 sm:pb-24"
      >
        <GarySection />
      </section>

      <section
        id="help-gary"
        className="bg-background py-12 sm:px-6 sm:pb-24"
      >
        <HelpGary />
      </section>
      <div className="relative z-10 -mb-12 h-32 w-full px-4 sm:h-48 sm:px-6">
        <Image
          src="/backgrounds/gradient2.png"
          alt=""
          fill
          className="hidden object-cover lg:block"
        />
      </div>
      <section
        id="earn"
        className="relative flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-24"
      >
        <Image
          src={`/backgrounds/2.jpg`}
          alt=""
          className="-z-10 object-cover"
          fill
        />
        <EarnWithGary />
      </section>
      <div className="relative -mb-12 -mt-8 h-40 w-full sm:-mb-16 sm:-mt-10 sm:h-60">
        <Image
          src={`/backgrounds/ice.svg`}
          alt=""
          className="object-cover"
          fill
        />
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
  );
}
