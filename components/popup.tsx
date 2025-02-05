"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AnchorLink } from "./anchor-link"

export const Popup = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-white to-[#CFEFFF] p-6 text-center shadow-lg">
      <button onClick={onClose} className="absolute right-[14px] top-[7px] text-3xl font-bold text-gray-500 hover:text-black">
        &times;
      </button>
      <h3 className="mb-4 font-heading text-2xl font-bold text-gary-blue">
        Win up to 300 $GARA everyday
      </h3>
      <p className="text-lg text-gray-700">Buy $GARA for at least $50 to unlock this feature</p>
      <div className="mt-6 flex justify-center">
        <Image
          src="/images/halt.png"
          alt="Gary"
          width={150}
          height={150}
          className="rounded-lg"
        />
      </div>
      <AnchorLink anchor="hero">
        <Button
          className="my-1 h-12 border-2 border-transparent bg-gary-yellow px-8 text-lg text-white shadow-md outline-none transition-all hover:border-gary-yellow hover:bg-white hover:text-gary-yellow dark:hover:bg-white dark:hover:text-gary-yellow"
          onClick={onClose}
        >
          Buy $GARA coin
        </Button>
      </AnchorLink>
    </div>
  </div>
)
