"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const clickInfoData = [
  {
    state: "state_1",
    image: "/images/state_1.png",
    clicks: "+1 Point",
  },
  {
    state: "state_2",
    image: "/images/state_2.png",
    clicks: "+2 Points",
  },
  {
    state: "state_3",
    image: "/images/state_3.png",
    clicks: "+5 Points",
  },
  {
    state: "state_4",
    image: "/images/state_4.png",
    clicks: "+10 Points",
  },
  {
    state: "state_5",
    image: "/images/state_5.png",
    clicks: <strong>$GARA reward</strong>, // Bold the "Airdrop" text
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
        className="flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-gary-blue focus:outline-none"
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        aria-label="Click info"
      >
        i
      </button>

      {/* Popup */}
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute -left-10 z-50 w-72 rounded-lg bg-white p-4 shadow-lg lg:bottom-[40px] lg:left-0"
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gary-blue">Click Rewards</h3>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <table className="w-full table-auto border-collapse border border-gray-200 text-left text-sm">
            <tbody>
              {clickInfoData.map((info, index) => (
                <tr key={info.state} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} text-gray-700`}>
                  <td className="p-2 pl-6">
                    <Image src={info.image} alt={info.state} width={24} height={24} className="rounded" />
                  </td>
                  <td className="p-2 text-center font-medium">{info.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
