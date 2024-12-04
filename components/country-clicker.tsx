"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const initialLeaderboard  = [
  { country: "Czechia", flag: "cz", clicks: 77384 },
  { country: "Germany", flag: "de", clicks: 116607 },
  { country: "Slovakia", flag: "sk", clicks: 15186 },
  { country: "Poland", flag: "pl", clicks: 30331 },
  { country: "Austria", flag: "at", clicks: 68429 },
  { country: "Hungary", flag: "hu", clicks: 23681 },
  { country: "United Kingdom", flag: "gb", clicks: 55444 },
  { country: "France", flag: "fr", clicks: 74646 },
  { country: "Italy", flag: "it", clicks: 24265 },
  { country: "Spain", flag: "es", clicks: 20597 },
  { country: "Netherlands", flag: "nl", clicks: 70201 },
  { country: "Belgium", flag: "be", clicks: 35758 },
  { country: "Switzerland", flag: "ch", clicks: 50342 },
  { country: "Sweden", flag: "se", clicks: 78696 },
  { country: "Norway", flag: "no", clicks: 8291 },
  { country: "Denmark", flag: "dk", clicks: 126552 },
  { country: "Finland", flag: "fi", clicks: 49355 },
  { country: "Ireland", flag: "ie", clicks: 119429 },
  { country: "Portugal", flag: "pt", clicks: 83861 },
  { country: "Greece", flag: "gr", clicks: 61184 },
  { country: "Bulgaria", flag: "bg", clicks: 22891 },
  { country: "Romania", flag: "ro", clicks: 55317 },
  { country: "Croatia", flag: "hr", clicks: 29784 },
  { country: "Slovenia", flag: "si", clicks: 19168 },
  { country: "Serbia", flag: "rs", clicks: 17284 },
  { country: "Bosnia & Herzegovina", flag: "ba", clicks: 11275 },
  { country: "Montenegro", flag: "me", clicks: 6523 },
  { country: "North Macedonia", flag: "mk", clicks: 9875 },
  { country: "Albania", flag: "al", clicks: 8574 },
  { country: "Lithuania", flag: "lt", clicks: 21745 },
  { country: "Latvia", flag: "lv", clicks: 19347 },
  { country: "Estonia", flag: "ee", clicks: 21489 },
  { country: "Ukraine", flag: "ua", clicks: 12758 },
  { country: "Belarus", flag: "by", clicks: 19584 },
  { country: "Russia", flag: "ru", clicks: 93284 },
  { country: "United States", flag: "us", clicks: 90317 },
  { country: "Canada", flag: "ca", clicks: 72104 },
  { country: "Mexico", flag: "mx", clicks: 65871 },
  { country: "Argentina", flag: "ar", clicks: 43217 },
  { country: "Chile", flag: "cl", clicks: 37416 },
  { country: "Colombia", flag: "co", clicks: 39172 },
  { country: "Peru", flag: "pe", clicks: 23785 },
  { country: "Ecuador", flag: "ec", clicks: 19357 },
  { country: "Venezuela", flag: "ve", clicks: 15249 },
  { country: "Uruguay", flag: "uy", clicks: 14384 },
  { country: "Paraguay", flag: "py", clicks: 12834 },
  { country: "Australia", flag: "au", clicks: 50384 },
  { country: "South Korea", flag: "kr", clicks: 71283 },
  { country: "China", flag: "cn", clicks: 60392 },
  { country: "India", flag: "in", clicks: 51324 },
  { country: "Pakistan", flag: "pk", clicks: 40292 },
  { country: "Bangladesh", flag: "bd", clicks: 39284 },
  { country: "Indonesia", flag: "id", clicks: 50412 },
  { country: "Malaysia", flag: "my", clicks: 31284 },
  { country: "Philippines", flag: "ph", clicks: 23194 },
  { country: "Thailand", flag: "th", clicks: 39481 },
  { country: "Singapore", flag: "sg", clicks: 31784 },
  { country: "Hong Kong", flag: "hk", clicks: 28394 },
  { country: "Taiwan", flag: "tw", clicks: 29372 },
  { country: "South Africa", flag: "za", clicks: 38917 },
  { country: "Egypt", flag: "eg", clicks: 29481 },
  { country: "Nigeria", flag: "ng", clicks: 28391 },
  { country: "Kenya", flag: "ke", clicks: 27384 },
  { country: "Morocco", flag: "ma", clicks: 26814 },
  { country: "Algeria", flag: "dz", clicks: 21491 },
  { country: "Tunisia", flag: "tn", clicks: 20384 },
  { country: "Libya", flag: "ly", clicks: 18374 },
  { country: "Sudan", flag: "sd", clicks: 13274 },
  { country: "Ethiopia", flag: "et", clicks: 11734 },
  { country: "Tanzania", flag: "tz", clicks: 10923 },
  { country: "Zambia", flag: "zm", clicks: 10492 },
  { country: "Zimbabwe", flag: "zw", clicks: 9284 },
  { country: "Angola", flag: "ao", clicks: 8392 },
  { country: "Mozambique", flag: "mz", clicks: 7938 },
  { country: "Namibia", flag: "na", clicks: 7284 },
  { country: "Botswana", flag: "bw", clicks: 6392 },
  { country: "Ghana", flag: "gh", clicks: 4823 },
  { country: "Senegal", flag: "sn", clicks: 4321 },
  { country: "Ivory Coast", flag: "ci", clicks: 4184 },
  { country: "Cameroon", flag: "cm", clicks: 3948 },
  { country: "Congo", flag: "cg", clicks: 3728 },
  { country: "Uganda", flag: "ug", clicks: 3524 },
  { country: "Rwanda", flag: "rw", clicks: 3128 },
  { country: "Burundi", flag: "bi", clicks: 2948 },
  { country: "Somalia", flag: "so", clicks: 2384 },
  { country: "Chad", flag: "td", clicks: 1847 },
  { country: "Niger", flag: "ne", clicks: 1728 },
  { country: "Mali", flag: "ml", clicks: 1583 },
  { country: "Burkina Faso", flag: "bf", clicks: 1438 },
  { country: "Gabon", flag: "ga", clicks: 1293 },
  { country: "Central African Republic", flag: "cf", clicks: 1193 },
  { country: "Madagascar", flag: "mg", clicks: 1092 },
  { country: "Mauritius", flag: "mu", clicks: 984 },
  { country: "Seychelles", flag: "sc", clicks: 892 },
  { country: "Malawi", flag: "mw", clicks: 738 },
  { country: "Sierra Leone", flag: "sl", clicks: 638 },
  { country: "Liberia", flag: "lr", clicks: 483 },
  { country: "Gambia", flag: "gm", clicks: 293 },
  { country: "Guinea", flag: "gn", clicks: 193 },
  { country: "Equatorial Guinea", flag: "gq", clicks: 0 },
  { country: "Cape Verde", flag: "cv", clicks: 0 },
  { country: "Djibouti", flag: "dj", clicks: 0 },
  { country: "Eswatini", flag: "sz", clicks: 0 },
  { country: "Lesotho", flag: "ls", clicks: 0 },
  { country: "Comoros", flag: "km", clicks: 0 },
  { country: "Sao Tome and Principe", flag: "st", clicks: 0 },
  { country: "Togo", flag: "tg", clicks: 0 },
  { country: "Benin", flag: "bj", clicks: 0 },
  { country: "Malta", flag: "mt", clicks: 0 },
  { country: "Cyprus", flag: "cy", clicks: 0 },
  { country: "Iceland", flag: "is", clicks: 0 },
  { country: "Luxembourg", flag: "lu", clicks: 0 },
  { country: "Monaco", flag: "mc", clicks: 0 },
  { country: "San Marino", flag: "sm", clicks: 0 },
  { country: "Andorra", flag: "ad", clicks: 0 },
  { country: "Liechtenstein", flag: "li", clicks: 0 },
  { country: "Vatican City", flag: "va", clicks: 0 },
  { country: "Armenia", flag: "am", clicks: 0 },
  { country: "Georgia", flag: "ge", clicks: 0 },
  { country: "Azerbaijan", flag: "az", clicks: 0 },
  { country: "Kazakhstan", flag: "kz", clicks: 0 },
  { country: "Uzbekistan", flag: "uz", clicks: 0 },
  { country: "Turkmenistan", flag: "tm", clicks: 0 },
  { country: "Kyrgyzstan", flag: "kg", clicks: 0 },
  { country: "Tajikistan", flag: "tj", clicks: 0 },
  { country: "Afghanistan", flag: "af", clicks: 0 },
  { country: "Iran", flag: "ir", clicks: 0 },
  { country: "Iraq", flag: "iq", clicks: 0 },
  { country: "Syria", flag: "sy", clicks: 0 },
  { country: "Jordan", flag: "jo", clicks: 0 },
  { country: "Lebanon", flag: "lb", clicks: 0 },
  { country: "Israel", flag: "il", clicks: 0 },
  { country: "Palestine", flag: "ps", clicks: 0 },
  { country: "Saudi Arabia", flag: "sa", clicks: 0 },
  { country: "Yemen", flag: "ye", clicks: 0 },
  { country: "Oman", flag: "om", clicks: 0 },
  { country: "UAE", flag: "ae", clicks: 0 },
  { country: "Qatar", flag: "qa", clicks: 0 },
  { country: "Bahrain", flag: "bh", clicks: 0 },
  { country: "Kuwait", flag: "kw", clicks: 0 },
  { country: "Turkey", flag: "tr", clicks: 0 },
  { country: "Maldives", flag: "mv", clicks: 0 },
  { country: "Sri Lanka", flag: "lk", clicks: 0 },
  { country: "Bhutan", flag: "bt", clicks: 0 },
  { country: "Nepal", flag: "np", clicks: 0 },
  { country: "Myanmar", flag: "mm", clicks: 0 },
  { country: "Vietnam", flag: "vn", clicks: 40172 },
  { country: "Cambodia", flag: "kh", clicks: 0 },
  { country: "Laos", flag: "la", clicks: 0 },
  { country: "Brunei", flag: "bn", clicks: 0 },
  { country: "East Timor", flag: "tl", clicks: 0 },
  { country: "Japan", flag: "jp", clicks: 68274 },
  { country: "Mongolia", flag: "mn", clicks: 0 },
  { country: "North Korea", flag: "kp", clicks: 0 },
  { country: "New Zealand", flag: "nz", clicks: 27384 },
  { country: "Papua New Guinea", flag: "pg", clicks: 0 },
  { country: "Fiji", flag: "fj", clicks: 0 },
  { country: "Solomon Islands", flag: "sb", clicks: 0 },
  { country: "Vanuatu", flag: "vu", clicks: 0 },
  { country: "Samoa", flag: "ws", clicks: 0 },
  { country: "Tonga", flag: "to", clicks: 0 },
  { country: "Kiribati", flag: "ki", clicks: 0 },
  { country: "Micronesia", flag: "fm", clicks: 0 },
  { country: "Marshall Islands", flag: "mh", clicks: 0 },
  { country: "Palau", flag: "pw", clicks: 0 },
  { country: "Nauru", flag: "nr", clicks: 0 },
  { country: "Tuvalu", flag: "tv", clicks: 0 },
  { country: "Guatemala", flag: "gt", clicks: 0 },
  { country: "Belize", flag: "bz", clicks: 0 },
  { country: "Honduras", flag: "hn", clicks: 0 },
  { country: "El Salvador", flag: "sv", clicks: 0 },
  { country: "Nicaragua", flag: "ni", clicks: 0 },
  { country: "Costa Rica", flag: "cr", clicks: 0 },
  { country: "Panama", flag: "pa", clicks: 0 },
  { country: "Guyana", flag: "gy", clicks: 0 },
  { country: "Suriname", flag: "sr", clicks: 0 },
  { country: "Brazil", flag: "br", clicks: 80492 },
  { country: "Bolivia", flag: "bo", clicks: 11492 },
  { country: "Trinidad & Tobago", flag: "tt", clicks: 0 },
  { country: "Barbados", flag: "bb", clicks: 0 },
  { country: "Jamaica", flag: "jm", clicks: 0 },
  { country: "Bahamas", flag: "bs", clicks: 0 },
  { country: "Cuba", flag: "cu", clicks: 0 },
  { country: "Haiti", flag: "ht", clicks: 0 },
  { country: "Dominican Republic", flag: "do", clicks: 0 }
];

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [userCountry, setUserCountry] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);

  // Detect user's country
  useEffect(() => {
    async function fetchCountry() {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        console.log("User country detected:", data.country_name);
        setUserCountry(data.country_name || "Czechia"); // Fallback to Czechia for testing
      } catch (error) {
        console.error("Error fetching user country:", error);
        setUserCountry("Czechia"); // Fallback to Czechia in case of error
      }
    }

    fetchCountry();
  }, []);

  // Sort the leaderboard by clicks (descending order)
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.clicks - a.clicks);

  // Determine user rank whenever userCountry or leaderboard changes
  useEffect(() => {
    if (userCountry) {
      const rank = sortedLeaderboard.findIndex(
        (item) => item.country === userCountry
      );
      console.log("Detected user rank:", rank + 1);
      setUserRank(rank !== -1 ? rank + 1 : null); // Ranks are 1-based
    }
  }, [userCountry, leaderboard]);

  // Increment clicks for the user's country
  const handleClick = () => {
    if (!userCountry) return;

    setLeaderboard((prevLeaderboard) =>
      prevLeaderboard.map((item) =>
        item.country === userCountry
          ? { ...item, clicks: item.clicks + 1 }
          : item
      )
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-4">
      {/* Leaderboard Button */}
      <button
        onClick={() => {
          handleClick();
          setIsOpen((prev) => !prev);
        }}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold pr-4">Leaderboard</span>
          {userRank && (
            <>
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
                {userCountry} #{userRank}
              </span>
            </>
          )}
        </div>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Leaderboard Content */}
      {isOpen && (
        <div
          className="absolute left-0 w-full bg-white shadow-lg rounded-lg overflow-hidden z-50"
          style={{ bottom: "100%" }} // Ensure the leaderboard opens upward
        >
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full table-fixed text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="w-2/12 px-2 py-2 text-gray-800 font-bold">Rank</th>
                  <th className="w-8/12 px-2 py-2 text-gray-800 font-bold">Country</th>
                  <th className="w-4/12 px-4 py-2 text-gray-800 font-bold text-right">
                    Clicks
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((item, index) => (
                  <tr
                    key={item.country}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 ${
                      item.country === userCountry ? "font-bold text-gray-900" : "text-gray-700"
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