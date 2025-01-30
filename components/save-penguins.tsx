"use client"

import { FC } from "react"
import Image from "next/image"
import { Heading } from "@/components/heading"

interface Section {
  type: "video" | "image"
  heading: string
  content: string
  asset: string // YouTube link or image path
}

const sections: Section[] = [
  {
    type: "video",
    heading: "Save Penguins",
    content:
      "African penguins are in serious trouble. Their numbers have plummeted over the past century due to the destruction of nesting sites, egg poaching, oil spills, global climate change, and competition for food resources with commercial fishing. There is hope to save these iconic species through organizations focusing on saving penguins.",
    asset: "https://www.youtube.com/embed/l-hhf3WcSQU",
  },
  {
    type: "image",
    heading: "Gary Got Adopted",
    content:
      "Penguin designated as AP 619 was found abandoned by its colony. Since it’s too young to survive on its own, it was taken to a rescue station, where it will stay until it grows strong enough to be released back into the wild and rejoin the penguin colony in Simon's Town. To support the efforts of this organization and ensure that this young penguin has everything it needs, we decided to adopt it and named him Gary. We are currently discussing the possibility of setting up a webcam to monitor his growth and eventual release.",
    asset: "/images/penguin.png",
  },
]

const SectionComponent: FC<{ section: Section; reverse: boolean }> = ({ section, reverse }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-16 items-center">
    {/* Asset Section */}
    <div className={`flex justify-center ${reverse ? "lg:order-2" : "lg:order-1"}`}>
      {section.type === "video" ? (
        <iframe
          width="600px"
          height="360px"
          src={section.asset}
          title={section.heading}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-3xl"
        ></iframe>
      ) : (
        <div className="relative w-[600px] h-[360px] rounded-3xl overflow-hidden">
          <Image src={section.asset} alt={section.heading} fill className="object-cover object-top" />
        </div>
      )}
    </div>

    {/* Text Section */}
    <div className={`flex flex-col justify-center ${reverse ? "lg:order-1" : "lg:order-2"}`}>
      <Heading className="text-center text-5xl font-bold lg:text-left text-gary-yellow">{section.heading}</Heading>
      <p className="mt-4 text-center text-xl font-normal text-white lg:text-left">{section.content}</p>
    </div>
  </div>
)

const SavePenguins: FC = () => {
  return (
    <div className="relative min-h-screen py-20 bg-[#061023]">
      <div className="mx-auto w-full md:max-w-[1440px] max-w-[90%]">
        {sections.map((section, index) => (
          <SectionComponent key={index} section={section} reverse={index % 2 !== 0} />
        ))}
      </div>
    </div>
  )
}

export default SavePenguins
