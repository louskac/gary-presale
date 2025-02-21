"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase" // Import your Supabase client

export default function AirdropWin({ onClose }: { onClose: () => void }) {
  const [walletAddress, setWalletAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false) // For submit state
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null) // For messages

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletAddress) {
      setMessage({ type: "error", text: "Please enter a valid wallet address." })
      return
    }

    setIsSubmitting(true)
    setMessage(null) // Clear previous messages

    try {
      const { data, error } = await supabase
        .from("winners")
        .insert([{ wallet_address: walletAddress, created_at: new Date().toISOString() }])

      if (error) {
        console.error("Error saving to database:", error.message)
        setMessage({ type: "error", text: "An error occurred while saving your information. Please try again." })
      } else {
        console.log("Winner saved:", data)
        setMessage({ type: "success", text: "Success" })
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    const text = encodeURIComponent(
      "I just won 10 USD worth of $GARA coin on https://www.helpgary.com, try your luck too!"
    )
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`
    window.open(twitterUrl, "_blank")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <section
        id="airdrop-win"
        className="relative mt-4 w-full max-w-md flex-1 rounded-2xl bg-gradient-to-b from-[#FFFFFF] to-[#CFEFFF] p-6 shadow-md"
      >
        <h3 className="mb-6 text-center font-heading text-3xl font-bold text-gary-blue">🎉 Congratulations! 🎉</h3>
        <p className="mb-4 text-center font-bold">
          You&apos;ve won <span className="text-gary-pink">100 $GARA</span> that is worth 10 USDT in an airdrop!
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="walletAddress" className="mb-2 block text-center font-bold">
            We give out the airdrop once to each wallet! Enter your EVM wallet address and share on X.com to claim the
            airdrop.:
          </label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0xYourWalletAddress"
            className="mb-4 w-full rounded-lg border border-gray-300 p-3"
          />
          {message && (
            <p
              className={`mb-4 text-center font-bold ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
            >
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`h-12 w-full rounded-full bg-[#061022] text-xl font-bold ${
              isSubmitting ? "cursor-not-allowed bg-gray-200 text-gray-400" : "text-[#FFAE17]"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        <button
          onClick={handleShare}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#1DA1F2] text-xl font-bold text-white"
        >
          <span className="mr-2">Share to</span>
          <svg
            className="fill-white"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 16 16"
            version="1.1"
            xmlSpace="preserve"
          >
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
          </svg>
        </button>
        <button onClick={onClose} className="mt-4 block w-full text-center text-sm text-gray-600 underline">
          Close
        </button>
      </section>
    </div>
  )
}
