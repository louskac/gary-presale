"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { useRef } from "react"

type LeaderboardEntry = {
  id: number
  country: string
  flag: string
  clicks: number
}

function incrementSmoothly(currentValue: number, targetValue: number, setValue: (val: number) => void) {
  const difference = targetValue - currentValue
  const step = Math.ceil(difference / 10) // Adjust 10 for speed

  if (difference === 0) return

  const interval = setInterval(() => {
    currentValue += step
    if ((step > 0 && currentValue >= targetValue) || (step < 0 && currentValue <= targetValue)) {
      currentValue = targetValue
      clearInterval(interval)
    }
    setValue(currentValue)
  }, 50) // Adjust timing for smoothness
}

function formatNumber(value: number): string {
  return value.toLocaleString() // Display number with commas (e.g., 1,234,567)
}

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [userCountry, setUserCountry] = useState<string | null>(null)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [secondCountry, setSecondCountry] = useState<string | null>(null)
  const [secondCountryRank, setSecondCountryRank] = useState<number | null>(null)

  const [isMobile, setIsMobile] = useState(false)
  const leaderboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (leaderboardRef.current && !leaderboardRef.current.contains(event.target as Node)) {
        setIsOpen(false) // Close the leaderboard
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768) // Adjust breakpoint as needed
    }

    handleResize() // Check on component mount
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Local storage changed. Updating leaderboard...")

      setLeaderboard((prevLeaderboard) => {
        return prevLeaderboard
          .map((entry) => {
            const localClicks = parseInt(localStorage.getItem(`clicks_${entry.country}`) || "0", 10)
            return { ...entry, clicks: Math.max(entry.clicks, localClicks) }
          })
          .sort((a, b) => b.clicks - a.clicks)
      })
    }

    // Listen to storage changes
    window.addEventListener("storage", handleStorageChange)

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("leaderboard").select("*").order("clicks", { ascending: false })

        if (error) {
          console.error("Error fetching leaderboard:", error)
          return
        }

        // Merge local storage data with Supabase data
        const mergedData = data.map((entry) => {
          const localClicks = parseInt(localStorage.getItem(`clicks_${entry.country}`) || "0", 10)
          return { ...entry, clicks: Math.max(entry.clicks, localClicks) }
        })

        setLeaderboard(mergedData)
      } catch (error) {
        console.error("Unexpected error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()

    const interval = setInterval(() => {
      fetchLeaderboard()
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  // Fetch user country
  useEffect(() => {
    async function fetchCountry() {
      const storedCountry = localStorage.getItem("userCountry")

      if (storedCountry) {
        console.log(`User country found in localStorage: ${storedCountry}`)
        setUserCountry(storedCountry)
      } else {
        try {
          console.log("Fetching country from IP geolocation API...")
          const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=fc55acc2a2644a55a04cba6d4829803b`)
          const data = await response.json()

          const fetchedCountry = data.country_name || "Unknown"
          console.log(`Fetched country: ${fetchedCountry}`)

          if (fetchedCountry !== "Unknown") {
            localStorage.setItem("userCountry", fetchedCountry)
            setUserCountry(fetchedCountry)
          } else {
            console.error("Could not fetch the user's country.")
          }
        } catch (error) {
          console.error("Error fetching user country:", error)
          setUserCountry("Unknown")
        }
      }
    }

    fetchCountry()
  }, [])

  // Calculate user rank and second country rank
  useEffect(() => {
    if (userCountry || secondCountry) {
      const userCountryRank = leaderboard.findIndex((item) => item.country === userCountry)
      const secondCountryRank = leaderboard.findIndex((item) => item.country === secondCountry)
      setUserRank(userCountryRank !== -1 ? userCountryRank + 1 : null)
      setSecondCountryRank(secondCountryRank !== -1 ? secondCountryRank + 1 : null)
    }
  }, [userCountry, secondCountry, leaderboard])

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.clicks - a.clicks)

  return (
    <div ref={leaderboardRef} className="relative mx-auto mt-4 lg:w-[400px] w-[370px]">
      {/* Leaderboard Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev)
        }}
        className="flex w-full items-center justify-between rounded-lg bg-gray-800 px-6 py-4 text-white hover:bg-gray-700 focus:outline-none"
      >
        {loading ? (
          <div className="flex w-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            {/* Leader Section */}
            {sortedLeaderboard.length > 0 && (
              <div className="flex items-center gap-2">
                <Image
                  src={`https://flagcdn.com/w40/${sortedLeaderboard[0]?.flag}.png`}
                  alt={`${sortedLeaderboard[0]?.country} flag`}
                  width={24}
                  height={16}
                  className="rounded"
                />
                <span className="text-sm font-bold">
                  #{1} {sortedLeaderboard[0]?.country} ({formatNumber(sortedLeaderboard[0]?.clicks)})
                </span>
              </div>
            )}

            {/* User's Country */}
            {userRank && userCountry !== "Unknown" && (
              <div className="flex items-center gap-2">
                <Image
                  src={`https://flagcdn.com/w40/${sortedLeaderboard[userRank - 1]?.flag}.png`}
                  alt={`${userCountry} flag`}
                  width={24}
                  height={16}
                  className="rounded"
                />
                <span className="text-sm font-bold">
                  #{userRank} {userCountry} ({formatNumber(sortedLeaderboard[userRank - 1]?.clicks)})
                </span>
              </div>
            )}

            {/* Second Country */}
            {secondCountryRank && secondCountry !== "Unknown" && (
              <div className="flex items-center gap-2">
                <Image
                  src={`https://flagcdn.com/w40/${sortedLeaderboard[secondCountryRank - 1]?.flag}.png`}
                  alt={`${secondCountry} flag`}
                  width={24}
                  height={16}
                  className="rounded"
                />
                <span className="text-sm font-bold">
                  #{secondCountryRank} {secondCountry} ({formatNumber(sortedLeaderboard[secondCountryRank - 1]?.clicks)}
                  )
                </span>
              </div>
            )}
          </div>
        )}
        {/* Toggle Icon */}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Leaderboard Content */}
      {isOpen && (
        <div
          className={`absolute left-0 z-50 w-full overflow-hidden rounded-lg bg-white shadow-lg ${
            isMobile ? "top-full" : "bottom-full"
          }`}
        >
          <div className="max-h-[400px] overflow-y-scroll">
            <table className="w-full table-fixed text-left">
              <thead className="sticky top-0 z-10 bg-gary-pink">
                <tr>
                  <th className="w-2/12 px-2 py-2 font-bold text-white">Rank</th>
                  <th className="w-8/12 px-2 py-2 font-bold text-white">Country</th>
                  <th className="w-4/12 px-4 py-2 text-right font-bold text-white">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((item, index) => (
                  <tr
                    key={item.country}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 ${
                      item.country === userCountry || item.country === secondCountry
                        ? "font-bold text-gary-pink"
                        : "font-bold text-gray-700"
                    }`}
                  >
                    <td className="px-2 py-2 font-medium">#{index + 1}</td>
                    <td className="flex items-center gap-2 truncate px-2 py-2">
                      <Image
                        src={`https://flagcdn.com/w40/${item.flag}.png`}
                        alt={`${item.country} flag`}
                        width={24}
                        height={16}
                        className="rounded"
                      />
                      {item.country}
                    </td>
                    <td className="truncate px-4 py-2 text-right font-medium">{item.clicks.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
