"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

type LeaderboardEntry = {
  id: number;
  country: string;
  flag: string;
  clicks: number;
};

function incrementSmoothly(currentValue: number, targetValue: number, setValue: (val: number) => void) {
  const difference = targetValue - currentValue;
  const step = Math.ceil(difference / 10); // Adjust 10 for speed

  if (difference === 0) return;

  const interval = setInterval(() => {
    currentValue += step;
    if ((step > 0 && currentValue >= targetValue) || (step < 0 && currentValue <= targetValue)) {
      currentValue = targetValue;
      clearInterval(interval);
    }
    setValue(currentValue);
  }, 50); // Adjust timing for smoothness
}

function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + "B";
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + "M";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + "k";
  }
  return value.toString();
}

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [secondCountry, setSecondCountry] = useState<string | null>(null);
  const [secondCountryRank, setSecondCountryRank] = useState<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    handleResize(); // Check on component mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from<LeaderboardEntry>("leaderboard")
          .select("*")
          .order("clicks", { ascending: false });
  
        if (error) {
          console.error("Error fetching leaderboard:", error);
        } else {
          setLeaderboard(data || []);
        }
      } catch (error) {
        console.error("Unexpected error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchLeaderboard(); // Initial fetch
  
    // Set an interval to fetch leaderboard data every 15 seconds
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 15000);
  
    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  

  // Fetch user country
  useEffect(() => {
    async function fetchCountry() {
      const storedCountry = localStorage.getItem("userCountry");
      const storedSecondCountry = localStorage.getItem("secondCountry");

      if (storedCountry && storedSecondCountry) {
        setUserCountry(storedCountry);
        setSecondCountry(storedSecondCountry);
      } else {
        try {
          const response = await fetch(
            `https://api.ipgeolocation.io/ipgeo?apiKey=fc55acc2a2644a55a04cba6d4829803b`
          );
          const data = await response.json();
          const fetchedCountry = data.country_name || "Unknown";
          const fetchedSecondCountry = data.state_prov || "Unknown";

          setUserCountry(fetchedCountry);
          setSecondCountry(fetchedSecondCountry);

          localStorage.setItem("userCountry", fetchedCountry);
          localStorage.setItem("secondCountry", fetchedSecondCountry);
        } catch (error) {
          console.error("Error fetching user country:", error);
          setUserCountry("Unknown");
          setSecondCountry("Unknown");
        }
      }
    }

    fetchCountry();
  }, []);

  // Calculate user rank and second country rank
  useEffect(() => {
    if (userCountry || secondCountry) {
      const userCountryRank = leaderboard.findIndex((item) => item.country === userCountry);
      const secondCountryRank = leaderboard.findIndex((item) => item.country === secondCountry);
      setUserRank(userCountryRank !== -1 ? userCountryRank + 1 : null);
      setSecondCountryRank(secondCountryRank !== -1 ? secondCountryRank + 1 : null);
    }
  }, [userCountry, secondCountry, leaderboard]);

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-4">
      {/* Leaderboard Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
      >
        {loading ? (
          <div className="flex justify-center items-center w-full">
            <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
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
                  src={`https://flagcdn.com/w40/${
                    sortedLeaderboard[userRank - 1]?.flag
                  }.png`}
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
                  src={`https://flagcdn.com/w40/${
                    sortedLeaderboard[secondCountryRank - 1]?.flag
                  }.png`}
                  alt={`${secondCountry} flag`}
                  width={24}
                  height={16}
                  className="rounded"
                />
                <span className="text-sm font-bold">
                  #{secondCountryRank} {secondCountry} (
                  {formatNumber(sortedLeaderboard[secondCountryRank - 1]?.clicks)})
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
          className={`absolute left-0 w-full bg-white shadow-lg rounded-lg overflow-hidden z-50 ${
            isMobile ? "top-full" : "bottom-full"
          }`}
        >
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full table-fixed text-left">
              <thead className="bg-gary-pink sticky top-0 z-10">
                <tr>
                  <th className="w-2/12 px-2 py-2 text-white font-bold">Rank</th>
                  <th className="w-8/12 px-2 py-2 text-white font-bold">Country</th>
                  <th className="w-4/12 px-4 py-2 text-white font-bold text-right">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((item, index) => (
                  <tr
                    key={item.country}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 ${
                      item.country === userCountry || item.country === secondCountry
                        ? "font-bold text-gary-pink"
                        : "font-bold text-gray-700"
                    }`}
                  >
                    <td className="px-2 py-2 font-medium">#{index + 1}</td>
                    <td className="px-2 py-2 flex items-center gap-2 truncate">
                      <Image
                        src={`https://flagcdn.com/w40/${item.flag}.png`}
                        alt={`${item.country} flag`}
                        width={24}
                        height={16}
                        className="rounded"
                      />
                      {item.country}
                    </td>
                    <td className="px-4 py-2 text-right font-medium truncate">
                      {item.clicks.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
