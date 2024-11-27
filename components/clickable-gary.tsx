'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CountdownTimer from "@/components/countdown-timer";

export default function GarySection() {
  const [garyImage, setGaryImage] = useState('/images/gary_happy.png'); // Default image
  const [isEating, setIsEating] = useState(false); // Prevent double clicks during animation
  const [highlightedBox, setHighlightedBox] = useState<string | null>(null); // Tracks which box to highlight
  const [isMobile, setIsMobile] = useState(false); // Tracks if the view is mobile

  const [imageStats, setImageStats] = useState({
    state_1: 0,
    state_2: 0,
    state_3: 0,
    state_4: 0,
  });

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getRandomState = () => {
    const states = [
      { state: 'state_1', eatImage: 'eat_1', weight: 50 },
      { state: 'state_2', eatImage: 'eat_2', weight: 30 },
      { state: 'state_3', eatImage: 'eat_3', weight: 15 },
      { state: 'state_4', eatImage: 'eat_4', weight: 5 },
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

  const handleGaryClick = () => {
    if (isEating) return; // Prevent double-clicking during animation
    setIsEating(true);

    const { state, eatImage } = getRandomState();

    setGaryImage(`/images/${eatImage}.png`);

    setImageStats((prevStats) => {
      const key = state as keyof typeof prevStats;
      const newStats = { ...prevStats, [key]: prevStats[key] + 1 };
      setHighlightedBox(state);
      setTimeout(() => setHighlightedBox(null), 300); // Remove highlight after 300ms
      return newStats;
    });

    setTimeout(() => {
      setGaryImage('/images/gary_happy.png');
      setIsEating(false);
    }, 500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center mt-6 lg:mt-0 lg:absolute lg:left-[80%] lg:top-[68%] lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2">
      {/* Layout based on screen size */}
      {isMobile ? (
        <>
          {/* Stats Boxes */}
          <div className="flex items-center justify-center flex-wrap gap-2 lg:gap-4 mb-4">
            {Object.entries(imageStats).map(([state, count]) => (
              <div
                key={state}
                className={`flex flex-col items-center justify-center rounded-xl p-2 font-heading shadow-md w-[64px] h-[64px] ${
                  highlightedBox === state
                    ? 'bg-yellow-300'
                    : 'bg-gradient-to-t from-blue-100 via-white to-white'
                }`}
              >
                <Image
                  src={`/images/${state}.png`}
                  alt={state}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <div className="text-lg font-bold text-black">{count}</div>
              </div>
            ))}
          </div>
          {/* Bubble */}
          <div className="relative mt-8">
            {/* Bubble positioned slightly higher */}
            <div className="absolute -top-0 left-[25%] left-1/2 transform -translate-x-1/2 w-[160px] h-[100px]">
              <Image
                src={`/images/story/slide2/bubble_m.png`} // Adjust bubble size
                alt="Speech Bubble"
                width={160}
                height={100}
                className="object-contain"
              />
              {/* Bubble Text */}
              <p className="absolute top-[60%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 text-black text-lg font-bold text-center">
                Click to feed me
              </p>
            </div>
            {/* Penguin */}
            <button onClick={handleGaryClick} className="focus:outline-none">
              <Image
                src={garyImage}
                alt="Gary"
                width={200}
                height={260}
                className="w-[200px] h-[260px] object-contain ml-[180px]"
              />
            </button>
          </div>
          <div className="mt-6">
            <p className="mb-4 text-center text-xl lg:text-2xl font-bold text-white">Gary doesn&apos;t have much time left</p>
            <CountdownTimer />
          </div>
        </>
      ) : (
        <>
          {/* Penguin */}
          <button onClick={handleGaryClick} className="focus:outline-none">
            <Image
              src={garyImage}
              alt="Gary"
              width={250}
              height={300}
              className="relative lg:w-[300px] lg:h-[340px]"
            />
          </button>
          {/* Bubble */}
          <div className="absolute left-[50%] -top-[40%] mb-4 w-[350px] h-[200px]">
            <p className="absolute top-[40%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 text-black text-3xl font-bold text-center">
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
          {/* Stats Boxes */}
          <div className="flex items-center justify-center gap-2 lg:gap-4 mt-4 flex-nowrap">
            {Object.entries(imageStats).map(([state, count]) => (
              <div
                key={state}
                className={`flex flex-col items-center justify-center rounded-xl p-2 font-heading shadow-md w-[64px] h-[64px] ${
                  highlightedBox === state
                    ? 'bg-yellow-300'
                    : 'bg-gradient-to-t from-blue-100 via-white to-white'
                }`}
              >
                <Image
                  src={`/images/${state}.png`}
                  alt={state}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <div className="text-lg font-bold text-black">{count}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}