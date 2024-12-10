"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CountdownTimer from "@/components/countdown-timer";
import Leaderboard from "@/components/country-clicker";
import { supabase } from "@/lib/supabase";

export default function GarySection() {
  const [garyImage, setGaryImage] = useState("/images/gary_happy.png");
  const [isEating, setIsEating] = useState(false);
  const [highlightedBox, setHighlightedBox] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [imageStats, setImageStats] = useState({
    state_1: 0,
    state_2: 0,
    state_3: 0,
    state_4: 0,
    //state_5: 0,
  });
  const [showAirdropPopup, setShowAirdropPopup] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getRandomState = () => {
    const states = [
      { state: "state_1", eatImage: "eat_1", weight: 50 },
      { state: "state_2", eatImage: "eat_2", weight: 30 },
      { state: "state_3", eatImage: "eat_3", weight: 15 },
      { state: "state_4", eatImage: "eat_4", weight: 5 },
      //{ state: "state_5", eatImage: "eat_5", weight: 100 },
    ];

    const totalWeight = states.reduce((sum, state) => sum + state.weight, 0);
    const rand = Math.random() * totalWeight;

    let cumulative = 0;
    for (let i = 0; i < states.length; i++) {
      cumulative += states[i].weight;
      if (rand < cumulative) {
        return states[i];
      }
    }
    return states[0];
  };

  useEffect(() => {
    const logCountryClicks = () => {
      const allKeys = Object.keys(localStorage).filter((key) => key.startsWith("clicks_"));
      const countryClicks = allKeys.reduce((acc, key) => {
        acc[key] = localStorage.getItem(key);
        return acc;
      }, {});
  
      console.log("Current Local Storage:", {
        userCountry: localStorage.getItem("userCountry"),
        clicks_Czech: localStorage.getItem("clicks_Czech Republic"),
        clicks_Mauritius: localStorage.getItem("clicks_Mauritius"),
      });
    };
  
    logCountryClicks();
  }, [imageStats]); // Logs whenever imageStats changes

  const updateCountryClicks = async (state: string) => {
    try {
      const userCountry = localStorage.getItem("userCountry") || "Unknown";
  
      if (userCountry === "Unknown") {
        console.error("User country not found in localStorage.");
        return;
      }
  
      console.log(`Updating clicks for user country: ${userCountry}`);
  
      // Fetch the current clicks for the user country from Supabase
      const { data, error: fetchError } = await supabase
        .from("leaderboard")
        .select("clicks")
        .eq("country", userCountry)
        .single();
  
      if (fetchError) {
        console.error("Error fetching clicks from database:", fetchError.message);
        return;
      }
  
      const currentClicks = data?.clicks || 0;
  
      // Increment clicks based on the passed state
      let increment = 0;
      if (state === "state_1") increment = 1;
      else if (state === "state_2") increment = 2;
      else if (state === "state_3") increment = 5;
      else if (state === "state_4") increment = 10;
  
      const newClicks = currentClicks + increment;
  
      // Update the database with the incremented clicks
      const { error: updateError } = await supabase
        .from("leaderboard")
        .update({ clicks: newClicks })
        .eq("country", userCountry);
  
      if (updateError) {
        console.error("Error updating clicks in the database:", updateError.message);
        return;
      }
  
      // Update local storage with the new value
      localStorage.setItem(`clicks_${userCountry}`, newClicks.toString());
      console.log(`LocalStorage updated for ${userCountry}: ${newClicks}`);
  
      // Trigger a manual storage event
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Unexpected error updating clicks:", error);
    }
  };
  
  const handleGaryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!event.isTrusted) {
      console.warn("Blocked an untrusted (scripted) click!");
      return;
    }

    if (isEating) return;
    setIsEating(true);
  
    const audio = new Audio("/sounds/eat.mp3");
    audio.play();
  
    // Get the random state
    const { state, eatImage } = getRandomState();
  
    // Update Gary's image based on the state
    setGaryImage(`/images/${eatImage}.png`);
  
    // Update the stats for the corresponding state
    setImageStats((prevStats) => {
      const key = state as keyof typeof prevStats;
      const newStats = { ...prevStats, [key]: prevStats[key] + 1 };
      setHighlightedBox(state);
      setTimeout(() => setHighlightedBox(null), 300);
      return newStats;
    });
  
    if (state === "state_5") {
      setShowAirdropPopup(true); // Show the popup for GARA drops
    }
  
    // Update clicks in Supabase with the actual state
    updateCountryClicks(state);
  
    setTimeout(() => {
      setGaryImage("/images/gary_happy.png");
      setIsEating(false);
    }, 500);
  };

  const handleAirdropSubmit = () => {
    if (!walletAddress) {
      alert("Please enter a valid wallet address.");
      return;
    }

    // Logic to handle the wallet address submission, e.g., send it to the database or API
    console.log("Wallet Address Submitted:", walletAddress);
    setShowAirdropPopup(false);
  };

  return (
    <div className="relative mt-6 flex flex-col items-center justify-center lg:absolute lg:left-[80%] lg:top-[68%] lg:mt-0 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:transform">
      {isMobile ? (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 lg:gap-4">
            {Object.entries(imageStats).map(([state, count]) => (
              <div
                key={state}
                className={`flex h-[64px] w-[64px] flex-col items-center justify-center rounded-xl p-2 font-heading shadow-md ${
                  highlightedBox === state ? "bg-yellow-300" : "bg-gradient-to-t from-blue-100 via-white to-white"
                }`}
              >
                <Image src={`/images/${state}.png`} alt={state} width={32} height={32} className="rounded" />
                <div className="text-lg font-bold text-black">{count}</div>
              </div>
            ))}
          </div>
          <Leaderboard />
          <div className="relative mt-8">
            <div className="absolute -top-0 left-1/2 left-[25%] h-[100px] w-[160px] -translate-x-1/2 transform">
              <Image
                src={`/images/story/slide2/bubble_m.png`}
                alt="Speech Bubble"
                width={160}
                height={100}
                className="object-contain"
              />
              <p className="absolute left-[45%] top-[60%] -translate-x-1/2 -translate-y-1/2 transform text-center text-lg font-bold text-black">
                Click to feed me
              </p>
            </div>
            <button onClick={(event) => handleGaryClick(event)} className="focus:outline-none">
              <Image
                src={garyImage}
                alt="Gary"
                width={200}
                height={260}
                className="ml-[180px] h-[260px] w-[200px] object-contain"
              />
            </button>
          </div>
          <div className="mt-6">
            <p className="mb-4 text-center text-xl font-bold text-white lg:text-2xl">
              Gary doesn&apos;t have much time left
            </p>
            <CountdownTimer />
          </div>
        </>
      ) : (
        <>
          <button onClick={(event) => handleGaryClick(event)} className="focus:outline-none">
            <Image src={garyImage} alt="Gary" width={250} height={300} className="relative lg:h-auto lg:w-auto" />
          </button>
          <div className="absolute -top-[45%] left-[40%] mb-4 h-[250px] w-[250px]">
            <p className="absolute left-[50%] top-[25%] -translate-x-1/2 -translate-y-1/2 transform text-center text-3xl font-bold text-gary-blue">
              Click to feed me
            </p>
            <Image
              src="/images/story/slide1/bubble.png"
              alt="Speech Bubble"
              width={256}
              height={148}
              className="object-contain"
            />
          </div>
          <div className="mt-4 flex flex-nowrap items-center justify-center gap-2 lg:gap-4">
            {Object.entries(imageStats).map(([state, count]) => (
              <div
                key={state}
                className={`flex h-[64px] w-[64px] flex-col items-center justify-center rounded-xl p-2 font-heading shadow-md ${
                  highlightedBox === state ? "bg-yellow-300" : "bg-gradient-to-t from-blue-100 via-white to-white"
                }`}
              >
                <Image src={`/images/${state}.png`} alt={state} width={32} height={32} className="rounded" />
                <div className="text-lg font-bold text-black">{count}</div>
              </div>
            ))}
          </div>
          <Leaderboard />
        </>
      )}

      {/* Airdrop Popup */}
      {showAirdropPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">🎉 You won a $GARA Airdrop! 🎉</h2>
            <p className="text-center mb-4">Enter your wallet address to receive your airdrop:</p>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Wallet Address"
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleAirdropSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
