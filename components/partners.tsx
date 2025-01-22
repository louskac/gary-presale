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

  useEffect(() => {
    if (partners.length === 0) return // Don't animate if there are no partners

    const interval = setInterval(() => {
      setOffset((prevOffset) => {
        const totalItems = partners.length * 10 // Total items with 10x duplication
        const nextOffset = prevOffset + 1

        return nextOffset % totalItems
      })
    }, 3000) // Adjust scroll interval (3 seconds)

    return () => clearInterval(interval)
  }, [partners.length])

  // Duplicate partners array 10 times for seamless infinite scrolling
  const duplicatedPartners = Array(10).fill(partners).flat()

  return (
    <div className="relative overflow-hidden py-6">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${offset * (100 / itemsPerView)}%)`,
        }}
      >
        {duplicatedPartners.map((partner, index) => (
          <div
            key={index}
            className={`flex-shrink-0 ${itemsPerView === 2 ? "w-1/2" : "w-1/5"} px-4`} // Adjust width dynamically
          >
            <a href={partner.link} target="_blank" rel="noopener noreferrer">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160} // Example width
                height={160} // Example height
                className="h-16 mx-auto object-contain rounded-lg transition-transform hover:scale-110"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnersCarousel
