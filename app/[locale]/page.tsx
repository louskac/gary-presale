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

export default function Home() {
  return (
    <main className="h-screen overflow-y-scroll">
      <section id="home" className="relative flex min-h-screen w-full flex-col items-center justify-start">
        <NavBar />
        <Image src={`/backgrounds/0.jpg`} alt="" className="-z-10 object-cover" priority quality={100} fill />
        <div className="flex h-full w-full flex-1 flex-col px-4 sm:px-6">
          <SaveGary />
        </div>
        <Image
          src={`/images/gary_happy.png`}
          alt="Gary"
          width={357}
          height={396}
          className="sm:-[257px] lg:right:-[0%] absolute right-[10%] top-[60%] -z-10 w-[250px] -translate-y-[-20%] sm:right-[5%] sm:-translate-y-[30%] md:w-[250px] lg:w-[357px]"
        />
        <div className="z-20 flex w-full flex-row justify-center">
          <ScrollToComicsButton />
        </div>
      </section>
      <div className="relative z-10 -mb-12 -mt-16 h-32 w-full px-4 sm:h-48 sm:px-6">
        <Image src="/backgrounds/gradient.png" alt="" fill className="object-cover" />
      </div>
      {/* Pro mobilní zařízení skryjeme sekci about a zobrazíme ji pouze na větších obrazovkách */}
      <section id="about" className="relative -mt-20 h-screen w-full md:snap-y md:snap-mandatory">
        <GarysStoryCarousel />
      </section>
      <section id="help-gary" className="bg-background px-4 py-12 sm:px-6 sm:pb-24">
        <HelpGary />
      </section>
      {/*
      <div className="relative -mb-12 -mt-12 h-32 w-full md:snap-none sm:-mb-16 sm:-mt-16 sm:h-48">
        <Image src="/backgrounds/gradient2.png" alt="" fill className="object-cover" /> 
      </div>
      */}
      <section id="earn" className="relative flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-24">
        <Image src={`/backgrounds/2.jpg`} alt="" className="-z-10 object-cover" fill />
        <EarnWithGary />
      </section>
      <div className="relative -mb-12 -mt-8 h-40 w-full sm:-mb-16 sm:-mt-10 sm:h-60">
        <Image src={`/backgrounds/ice.svg`} alt="" className="object-cover" fill />
      </div>
      <section id="save" className="-mt-32 flex bg-background px-4 sm:-mt-44 sm:px-6">
        <SavePenguins />
      </section>
      <section id="faq" className="bg-background px-4 sm:px-6">
        <Faq />
      </section>
      <section id="footer" className=" bg-[#050D1C] px-4 sm:px-6">
        <Footer />
      </section>
    </main>
  )
}
