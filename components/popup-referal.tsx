"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heading } from "./heading"

export const ReferralPopup = ({ onClose }: { onClose: () => void }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("0x48...2B95") // Mock wallet address

  const walletConnect = () => {
    setIsConnected(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-white to-[#CFEFFF] p-6 text-center shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[14px] top-[7px] text-3xl font-bold text-gray-500 hover:text-black"
        >
          &times;
        </button>

        {/* Initial State */}
        {!isConnected && (
          <>
            <Heading className="mb-8 text-center text-4xl font-bold lg:text-xl">
              Thank you for choosing to promote $GARA!
            </Heading>
            <p className="mb-4 text-lg font-semibold text-gray-800">
              Earn up to 10% reward in USDT on purchases made through your referral link!
            </p>
            <div className="mb-6 rounded-lg bg-gray-300 p-3 text-sm text-gray-600">
              To get your unique referral link, please connect your wallet first.
            </div>
            <Button
              onClick={walletConnect}
              className="w-full h-12 rounded-full bg-gary-pink text-lg font-bold text-white"
            >
              Connect Wallet
            </Button>
          </>
        )}

        {/* Connected State */}
        {isConnected && (
          <>
            <Heading className="mb-4 text-center text-4xl font-bold lg:text-xl">
              Thank you for choosing to promote $GARA!
            </Heading>
            <p className="mb-4 text-lg font-semibold text-gray-800">
              Earn up to 10% reward in USDT on purchases made through your referral link!
            </p>
            <Button className="w-full h-12 rounded-full bg-gary-pink text-lg font-bold text-white">
              Generate Code
            </Button>
            <div className="my-4 rounded-lg bg-gray-300 p-3 text-lg font-bold text-gray-700">
              Connected Wallet ({walletAddress})
            </div>
            <div className="mt-4 mx-auto w-fit rounded-full bg-green-500 py-2 px-4 text-white font-semibold">
              Referral Active
            </div>
            <div className="mt-4 text-center text-gray-800">
              <p>
                Your Referral USDT Current Phase Balance: <span className="font-bold">0.00</span>
              </p>
              <p>
                Your Referral USDT Claimable Balance: <span className="font-bold">0.00</span>
              </p>
            </div>
            <Button
              disabled
              className="mt-4 w-full h-12 rounded-full bg-gray-800 text-lg font-bold text-white cursor-not-allowed"
            >
              Claim Referral Earnings
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
