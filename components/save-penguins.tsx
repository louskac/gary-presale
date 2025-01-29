"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Heading } from "./heading"

export const SavePenguins = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024) // Tailwind's lg breakpoint
    }

    handleResize() // Initial check
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative min-h-screen py-10 md:py-40 bg-[#061023]">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-8">
        {/* First Section */}
        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} flex-wrap justify-between lg:gap-16`}>
          {/* Left Column: Video */}
          {!isMobile && (
            <div className="relative m-auto h-[400px] w-full overflow-hidden rounded-3xl lg:w-[576px]">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/l-hhf3WcSQU"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="object-cover"
              ></iframe>
            </div>
          )}

          {/* Right Column: Heading & Text */}
          <div className="flex flex-col justify-center lg:w-[640px]">
            <Heading className="mt-6 lg:mt-20 text-center text-6xl font-bold leading-none tracking-normal lg:text-left">
              Save penguins
            </Heading>
            {isMobile && (
              <div className="relative mt-6 h-[400px] w-full overflow-hidden rounded-3xl">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/l-hhf3WcSQU"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="object-cover"
                ></iframe>
              </div>
            )}
            <p className="mt-4 text-center text-xl font-normal lg:font-bold text-white lg:text-left">
              African penguins are in serious trouble. Their numbers have plummeted over the past century due to the
              destruction of nesting sites, egg poaching, oil spills, global climate change, and competition for food
              resources with commercial fishing. There is hope to save these iconic species through organizations focusing
              on saving penguins.
            </p>
          </div>
        </div>

        {/* Second Section */}
        <div className={`mt-16 flex ${isMobile ? "flex-col" : "flex-row"} flex-wrap justify-between lg:gap-16`}>
          {/* Text Section */}
          <div className="flex flex-col justify-center lg:w-[700px]">
            <Heading className="text-center text-6xl font-bold tracking-wider text-gary-yellow lg:text-left">
              Gary got adopted
            </Heading>
            <p className="mt-4 text-center text-xl font-normal lg:font-bold text-white lg:text-left">
              Penguin designated as AP 619 was found abandoned by its colony. Since it’s too young to survive on its own,
              it was taken to a rescue station, where it will stay until it grows strong enough to be released back into
              the wild and rejoin the penguin colony in Simon&apos;s Town. To support the efforts of this organization and
              ensure that this young penguin has everything it needs, we decided to adopt it and named him Gary. We are
              currently discussing the possibility of setting up a webcam to monitor his growth and eventual release.
            </p>
          </div>

          {/* Penguin Image Section */}
          <div className="relative mt-10 h-[500px] w-full overflow-hidden rounded-3xl lg:mt-0 lg:w-[540px]">
            <Image
              src={`/images/penguin.png`}
              alt="Penguin"
              fill
              sizes="(max-width: 1024px) 100vw, 540px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
