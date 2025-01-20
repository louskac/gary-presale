"use client"

import React from "react"
import Image from "next/image"

export const Popup = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-white to-[#CFEFFF] p-6 text-center shadow-lg">
      <button onClick={onClose} className="absolute right-[14px] top-[7px] text-3xl font-bold text-gray-500 hover:text-black">
        &times;
      </button>
      <h3 className="mb-4 font-heading text-2xl font-bold text-gary-blue">
        You can't win any airdrop yet
      </h3>
      <p className="text-lg text-gray-700">You need to purchase the token to participate in this game</p>
      <div className="mt-6 flex justify-center">
        <Image
          src="/images/halt.png" // Make sure this path points to the image you want.
          alt="Gary"
          width={150}
          height={150}
          className="rounded-lg"
        />
      </div>
      <button
        onClick={onClose}
        className="mt-8 h-12 rounded-lg border-2 border-transparent bg-gary-pink px-6 text-lg font-bold text-white shadow-md transition-all hover:border-gary-pink hover:bg-white hover:text-gary-pink"
      >
        Close
      </button>
    </div>
  </div>
)
