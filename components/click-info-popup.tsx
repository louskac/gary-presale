"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const clickInfoData = [
  {
    state: "state_1",
    image: "/images/state_1.png",
    clicks: "+1 Click",
    weight: "50%",
  },
  {
    state: "state_2",
    image: "/images/state_2.png",
    clicks: "+2 Clicks",
    weight: "30%",
  },
  {
    state: "state_3",
    image: "/images/state_3.png",
    clicks: "+5 Clicks",
    weight: "15%",
  },
  {
    state: "state_4",
    image: "/images/state_4.png",
    clicks: "+10 Clicks",
    weight: "5%",
  },
  {
    state: "state_5",
    image: "/images/state_5.png",
    clicks: <strong>Airdrop</strong>, // Bold the "Airdrop" text
    weight: <strong>0.1%</strong>,
  },
]

export default function ClickInfoPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false) // Close the popup
      }
    }

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPopupOpen])

  return (
    <div className="relative flex flex-col items-center">
      {/* Styled Info Icon */}
      <button
        className="flex h-6 w-6 items-center justify-center rounded-full bg-gary-pink text-white hover:bg-gary-blue focus:outline-none"
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        aria-label="Click info"
      >
        i
      </button>

      {/* Popup */}
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute right-10 z-50 w-72 rounded-lg bg-white p-4 shadow-lg lg:bottom-[40px] lg:right-0"
        >
          <h3 className="mb-2 text-center text-lg font-bold text-gary-blue">Click Rewards</h3>
          <table className="w-full table-auto border-collapse border border-gray-200 text-left text-sm">
            <thead>
              <tr className="bg-gary-pink text-white">
                <th className="p-2">Image</th>
                <th className="p-2">Clicks</th>
                <th className="p-2">Chance</th>
              </tr>
            </thead>
            <tbody>
              {clickInfoData.map((info, index) => (
                <tr key={info.state} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} text-gray-700`}>
                  <td className="p-2">
                    <Image src={info.image} alt={info.state} width={24} height={24} className="rounded" />
                  </td>
                  <td className="p-2 font-medium">{info.clicks}</td>
                  <td className="p-2">{info.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
