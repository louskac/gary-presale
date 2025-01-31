"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"

type Partner = {
  name: string
  logo: string
  link: string
}

type PartnersCarouselProps = {
  partners: Partner[]
}

const PartnersCarousel: React.FC<PartnersCarouselProps> = ({ partners }) => {
  const [itemsPerView, setItemsPerView] = useState(5) // Default for desktop
  const [offset, setOffset] = useState(0)
  const [isPaused, setIsPaused] = useState(false) // To track hover state

  // Adjust itemsPerView based on screen size
  useEffect(() => {
    const updateView = () => {
      const isMobileView = window.innerWidth < 768
      setItemsPerView(isMobileView ? 2 : 5) // 2 for mobile, 5 for desktop
    }

    updateView()
    window.addEventListener("resize", updateView)

    return () => {
      window.removeEventListener("resize", updateView)
    }
  }, [])

  // Animation logic for smooth scrolling
  useEffect(() => {
    if (partners.length === 0 || isPaused) return // Don't animate if no partners or paused

    const step = 0.01 // Smaller step for smoother transition
    const intervalTime = 50 // Smaller interval for smooth animation
    const totalItems = partners.length * 10 // Total items with 10x duplication

    const interval = setInterval(() => {
      setOffset((prevOffset) => {
        const nextOffset = prevOffset + step
        return nextOffset % totalItems // Wrap around when reaching the end
      })
    }, intervalTime)

    return () => clearInterval(interval)
  }, [partners.length, isPaused])

  // Duplicate partners array 10 times for seamless infinite scrolling
  const duplicatedPartners = Array(10).fill(partners).flat()

  return (
    <div
      className="relative overflow-hidden py-6"
      onMouseEnter={() => setIsPaused(true)} // Pause on hover
      onMouseLeave={() => setIsPaused(false)} // Resume on mouse leave
    >
      <div
        className="flex transition-transform ease-linear"
        style={{
          transform: `translateX(-${offset * (100 / itemsPerView)}%)`,
        }}
      >
        {duplicatedPartners.map((partner, index) => (
          <div
            key={index}
            className={`flex-shrink-0 ${itemsPerView === 2 ? "w-1/2" : "w-1/5"} px-2`} // Adjust width dynamically
          >
            <a href={partner.link} target="_blank" rel="noopener noreferrer">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={200}
                height={200}
                className={`h-16 mx-auto object-contain rounded-lg transition-transform ${
                  index === 7 ? "scale-110 hover:scale-125" : "hover:scale-110"
                }`}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnersCarousel
