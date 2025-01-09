"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid" // Import uuid
import Image from "next/image"
import CountdownTimer from "@/components/countdown-timer"
import Leaderboard from "@/components/country-clicker"
import { supabase } from "@/lib/supabase"
import AirdropWin from "@/components/airdrop-win"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import ReCAPTCHA from "react-google-recaptcha"
import { Heading } from "@/components/heading"

export default function GarySection() {
  const [garyImage, setGaryImage] = useState("/images/gary_happy.png")
  const [nonce, setNonce] = useState<string>("")
  const [isEating, setIsEating] = useState(false)
  const [highlightedBox, setHighlightedBox] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [imageStats, setImageStats] = useState({
    state_1: 0,
    state_2: 0,
    state_3: 0,
    state_4: 0,
    state_5: 0,
  })
  const [showAirdropPopup, setShowAirdropPopup] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [clickCount, setClickCount] = useState(0)
  const [showAirdropWin, setShowAirdropWin] = useState(false)
  const [botDetected, setBotDetected] = useState(false)
  const [captchaVisible, setCaptchaVisible] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [captchaResetCount, setCaptchaResetCount] = useState(0)

  const CAPTCHA_SITE_KEY = "6LfiEp0qAAAAAAKwr3XEAGNaloI3-iuXnyDj8aPm"

  useEffect(() => {
    // Generate a secure nonce when the page loads
    const generateNonce = () => {
      const storedNonce = localStorage.getItem("gary_nonce")
      if (!storedNonce) {
        const newNonce = uuidv4() // Generate a new nonce if not already set
        setNonce(newNonce)
        localStorage.setItem("gary_nonce", newNonce)
      } else {
        setNonce(storedNonce) // Use the existing nonce if already set
      }
    }

    generateNonce()
  }, [])

  const validateNonce = () => {
    const storedNonce = localStorage.getItem("gary_nonce")
    if (storedNonce === nonce) {
      const newNonce = uuidv4() // Generate a new nonce after successful validation
      setNonce(newNonce)
      localStorage.setItem("gary_nonce", newNonce)
      return true
    }

    // If nonce is invalid or missing, log a warning and return false
    console.warn("Invalid or missing nonce.")
    return false
  }

  const handleCaptchaSuccess = () => {
    setCaptchaVerified(true)
    setCaptchaVisible(false)
    setCaptchaResetCount(0) // Reset the click counter after CAPTCHA verification
    console.log("CAPTCHA verified. Continuing clicks.")
  }

  useEffect(() => {
    const detectBot = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      if (result.botProbability > 0.8) {
        console.warn("Bot detected. Blocking interaction.")
        setBotDetected(true)
      } else {
        setBotDetected(false)
      }
    }

    detectBot()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const getRandomState = () => {
    const states = [
      { state: "state_1", eatImage: "eat_1", weight: 1000 },
      { state: "state_2", eatImage: "eat_2", weight: 600 },
      { state: "state_3", eatImage: "eat_3", weight: 300 },
      { state: "state_4", eatImage: "eat_4", weight: 100 },
      { state: "state_5", eatImage: "eat_5", weight: getState5Weight() },
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

  const getState5Weight = () => {
    const clickCount = localStorage.getItem("clickCount") || 0;
    if (clickCount < 5000) {
      return 1;
    } else if (clickCount < 10000) {
      return 0.2;
    } else {
      return 0.1;
    }
  };

  useEffect(() => {
    const logCountryClicks = () => {
      const allKeys = Object.keys(localStorage).filter((key) => key.startsWith("clicks_"))
      const countryClicks = allKeys.reduce((acc, key) => {
        acc[key] = localStorage.getItem(key)
        return acc
      }, {})

      console.log("Current Local Storage:", {
        userCountry: localStorage.getItem("userCountry"),
        clicks_Czech: localStorage.getItem("clicks_Czech Republic"),
        clicks_Mauritius: localStorage.getItem("clicks_Mauritius"),
      })
    }

    logCountryClicks()
  }, [imageStats]) // Logs whenever imageStats changes

  const updateCountryClicks = async (state: string) => {
    try {
      const userCountry = localStorage.getItem("userCountry") || "Unknown"

      if (userCountry === "Unknown") {
        console.error("User country not found in localStorage.")
        return
      }

      console.log(`Updating clicks for user country: ${userCountry}`)

      // Fetch the current clicks for the user country from Supabase
      const { data, error: fetchError } = await supabase
        .from("leaderboard")
        .select("clicks")
        .eq("country", userCountry)
        .single()

      if (fetchError) {
        console.error("Error fetching clicks from database:", fetchError.message)
        return
      }

      const currentClicks = data?.clicks || 0

      // Increment clicks based on the passed state
      let increment = 0
      if (state === "state_1") increment = 1
      else if (state === "state_2") increment = 2
      else if (state === "state_3") increment = 5
      else if (state === "state_4") increment = 10
      else if (state === "state_5") increment = 20

      const newClicks = currentClicks + increment

      // Update the database with the incremented clicks
      const { error: updateError } = await supabase
        .from("leaderboard")
        .update({ clicks: newClicks })
        .eq("country", userCountry)

      if (updateError) {
        console.error("Error updating clicks in the database:", updateError.message)
        return
      }

      // Update local storage with the new value
      localStorage.setItem(`clicks_${userCountry}`, newClicks.toString())
      console.log(`LocalStorage updated for ${userCountry}: ${newClicks}`)

      // Trigger a manual storage event
      window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error("Unexpected error updating clicks:", error)
    }
  }

  const handleGaryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!event.isTrusted) {
      console.warn("Blocked an untrusted (scripted) click!")
      return
    }

    if (botDetected) {
      console.warn("Bot activity detected. Click blocked.")
      return
    }

    if (!validateNonce()) {
      console.warn("Invalid or missing nonce. Blocking click.")
      return
    }

    // Show CAPTCHA if it's not verified and the click count reaches 20
    if (!captchaVerified && clickCount >= 20) {
      console.warn("CAPTCHA required. Displaying CAPTCHA.")
      setCaptchaVisible(true)
      return
    }

    if (captchaResetCount >= 200) {
      setCaptchaVisible(true)
      setCaptchaVerified(false)
      console.warn("CAPTCHA required. Displaying CAPTCHA.")
      return
    }

    console.log("Nonce validated, proceeding...")

    if (isEating) return
    setIsEating(true)

    const audio = new Audio("/sounds/eat.mp3")
    audio.play()

    const { state, eatImage } = getRandomState()

    setGaryImage(`/images/${eatImage}.png`)

    setImageStats((prevStats) => {
      const key = state as keyof typeof prevStats
      const newStats = { ...prevStats, [key]: prevStats[key] + 1 }
      setHighlightedBox(state)
      setTimeout(() => setHighlightedBox(null), 300)
      return newStats
    })

    updateCountryClicks(state)

    // Only increment click counts after animation delay
    setTimeout(() => {
      setGaryImage("/images/gary_happy.png")
      setIsEating(false)

      setClickCount((prevCount) => {
        let increment = 0
        if (state === "state_1") increment = 1
        else if (state === "state_2") increment = 2
        else if (state === "state_3") increment = 5
        else if (state === "state_4") increment = 10
        else if (state === "state_5") {
          setShowAirdropWin(true)
          increment = 20
        }
        console.log(`Incrementing by ${increment}`)
        return prevCount + increment
      })

      setCaptchaResetCount((prev) => prev + 1)
      console.log("Click registered after animation.")
    }, 500) // Syncs with animation duration
  }

  return (
    <div className="relative mt-6 flex flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-between lg:gap-12 mx-4 lg:mx-40 mt-40">
      {captchaVisible && !captchaVerified ? (
        // CAPTCHA Section
        <div className="captcha-container flex flex-col items-center justify-center rounded-lg bg-gray-800 p-4 shadow-md">
          <p className="mb-4 text-lg font-bold text-white">Please verify that you are human to continue!</p>
          <div className="mb-4">
            <ReCAPTCHA sitekey={CAPTCHA_SITE_KEY} onChange={handleCaptchaSuccess} />
          </div>
          <button
            onClick={() => {
              if (captchaVerified) setCaptchaVisible(false);
            }}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
          >
            Continue
          </button>
        </div>
      ) : (
        <>
          {/* Left Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <button onClick={handleGaryClick} className="relative focus:outline-none">
                <div className="relative flex flex-col items-center mb-[50px]">
                  {/* Gary Image */}
                  <Image
                    src={garyImage}
                    alt="Gary"
                    width={200}
                    height={260}
                    className="relative z-10 object-contain"
                  />
                  {/* Larger Ice Block */}
                  <Image
                    src="/images/ice_block.svg"
                    alt="Ice Block"
                    width={700} 
                    height={400}
                    className="absolute bottom-[-30px] object-contain scale-[1.5] lg:scale-[2]"
                  />
                </div>
              </button>
              <div className="absolute -top-[45%] left-[40%] lg:left-[60%] mb-4 h-[200px] w-[200px]">
                <p className="absolute left-[55%] top-[28%] -translate-x-1/2 -translate-y-1/2 transform text-center text-xl font-bold text-gary-blue">
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
            </div>
            <p className="mt-4 text-center text-lg font-bold text-white">Your score: {clickCount}</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {Object.entries(imageStats).map(([state, count]) => (
                <div
                  key={state}
                  className="flex h-[64px] w-[64px] flex-col items-center justify-center rounded-xl p-2 bg-gradient-to-t from-blue-100 via-white to-white shadow-md"
                >
                  <Image
                    src={`/images/${state}.png`}
                    alt={state}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <p className="text-lg font-bold text-black">{count}</p>
                </div>
              ))}
            </div>
            <Leaderboard />
          </div>
  
          {/* Right Section */}
          <div className="mt-8 lg:mt-0 flex flex-col items-start lg:w-1/2">
            <Heading className="text-center text-4xl font-bold leading-none tracking-normal lg:text-6xl mb-4">
              Feed Gary & win 100 $GARA
            </Heading>
            <p className="mt-2 text-base text-white">
              <span className="font-bold">Every click has a chance to earn 100 $GARA!</span> You
              can win a maximum of <span className="font-bold">3 times per day</span> (300 $GARA in total).
              To receive the $GARA tokens, you need to enter your wallet in the winning pop-up window.
              The earned $GARA from the clicks will be credited at the end of each month.
            </p>
            <div className="mt-4 w-full">
              <h3 className="text-lg font-bold text-white">Click Rewards</h3>
                <div className="mt-2 grid grid-cols-2 gap-3 lg:flex lg:flex-wrap lg:gap-4 w-full">
                  {/* First Reward */}
                  <div className="flex items-center gap-2 rounded-xl bg-gray-600 p-2">
                    <Image
                      src={`/images/state_1.png`}
                      alt="fish"
                      width={32}
                      height={32}
                      className="rounded"
                    />
                    <p className="text-white font-bold">+1 point</p>
                  </div>

                  {/* Second Reward */}
                  <div className="flex items-center gap-2 rounded-xl bg-gray-600 p-2">
                    <Image
                      src={`/images/state_2.png`}
                      alt="fish"
                      width={32}
                      height={32}
                      className="rounded"
                    />
                    <p className="text-white font-bold">+2 point</p>
                  </div>

                  {/* Third Reward */}
                  <div className="flex items-center gap-2 rounded-xl bg-gray-600 p-2">
                    <Image
                      src={`/images/state_3.png`}
                      alt="fish"
                      width={32}
                      height={32}
                      className="rounded"
                    />
                    <p className="text-white font-bold">+5 point</p>
                  </div>

                  {/* Fourth Reward */}
                  <div className="flex items-center gap-2 rounded-xl bg-gray-600 p-2">
                    <Image
                      src={`/images/state_4.png`}
                      alt="fish"
                      width={32}
                      height={32}
                      className="rounded"
                    />
                    <p className="text-white font-bold">+10 point</p>
                  </div>

                  {/* Last Reward */}
                  <div className="flex items-center gap-2 rounded-xl bg-gray-600 p-2 col-span-2">
                    <Image
                      src={`/images/state_5.png`}
                      alt="fish"
                      width={32}
                      height={32}
                      className="rounded"
                    />
                    <p className="text-white font-bold">100 $GARA reward</p>
                  </div>
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
