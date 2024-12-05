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
  });

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

  const updateCountryClicks = async () => {
    try {
      // Retrieve the country from localStorage
      const userCountry = localStorage.getItem("userCountry") || "Unknown";

      if (userCountry === "Unknown") {
        console.error("Country not available in localStorage.");
        return;
      }

      // Fetch the current clicks for the user's country
      const { data: countryData, error: fetchError } = await supabase
        .from("leaderboard") // Replace with your actual table name
        .select("clicks")
        .eq("country", userCountry)
        .single(); // Fetch a single row

      if (fetchError) {
        console.error("Error fetching current clicks:", fetchError.message);
        return;
      }

      // Increment the clicks
      const newClicks = (countryData?.clicks || 0) + 1;

      // Update the clicks in the database
      const { error: updateError } = await supabase
        .from("leaderboard") // Replace with your actual table name
        .update({ clicks: newClicks })
        .eq("country", userCountry);

      if (updateError) {
        console.error("Error updating clicks:", updateError.message);
      } else {
        console.log(`Successfully updated clicks for ${userCountry}: ${newClicks}`);
      }
    } catch (error) {
      console.error("Unexpected error updating clicks:", error);
    }
  };

  const handleGaryClick = () => {
    if (isEating) return;
    setIsEating(true);

    const audio = new Audio("/sounds/eat.mp3");
    audio.play();

    const { state, eatImage } = getRandomState();

    setGaryImage(`/images/${eatImage}.png`);

    setImageStats((prevStats) => {
      const key = state as keyof typeof prevStats;
      const newStats = { ...prevStats, [key]: prevStats[key] + 1 };
      setHighlightedBox(state);
      setTimeout(() => setHighlightedBox(null), 300);
      return newStats;
    });

    // Update clicks in Supabase
    updateCountryClicks();

    setTimeout(() => {
      setGaryImage("/images/gary_happy.png");
      setIsEating(false);
    }, 500);
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
            <button onClick={handleGaryClick} className="focus:outline-none">
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
          <button onClick={handleGaryClick} className="focus:outline-none">
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
    </div>
  );
}
