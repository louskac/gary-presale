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
    <div className="m-auto block text-center">
      <div className="mt-0 sm:mt-16 flex flex-col items-center">
        <Button
          onClick={handleClick}
          size="lg"
          className="mt-10 border-none bg-black/70 px-10 py-10 text-md md:text-xl text-center whitespace-normal break-words max-w-full sm:max-w-[90%] mx-auto hover:!bg-black/80 z-[100]"
        >
          Find out how you can help Gary
        </Button>
      </div>
      <button onClick={handleClick} className="animate-slow-bounce">
        <ArrowDown className="z-10 mt-4 size-28 text-white" />
      </button>
    </div>
  )
}
