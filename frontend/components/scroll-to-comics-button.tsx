"use client"

import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const ScrollToComicsButton = () => {
  const handleClick = () => {
    // scroll to element id
    if (document) {
      document.getElementById("about").scrollIntoView({ behavior: "smooth" })
    }
  }
  return (
    <div className="z-[800] m-auto block text-center">
      <div className="mt-0 flex flex-col items-center sm:mt-16">
        <Button
          onClick={handleClick}
          size="lg"
          className="text-md mx-auto mt-10 max-w-full whitespace-normal break-words border-none bg-black/70 px-10 py-10 text-center hover:!bg-black/80 sm:max-w-[90%] md:text-xl"
        >
          Find out how to help Gary
        </Button>
      </div>
      <button onClick={handleClick} className="animate-slow-bounce">
        <ArrowDown className="mt-4 size-28 text-white" />
      </button>
    </div>
  )
}
