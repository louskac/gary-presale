import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Heading } from "./heading"

const tokenomicsPie = "/images/tokenomics/tokenomicsPie.png"
const tokenomicsGARY = "/images/tokenomics/tokenomicsGARY.png"

function Tokenomics() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768) // Adjust breakpoint as needed
    }

    handleResize() // Check on component mount
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="my-32">
      <div className="relative m-auto bg-[#0D1E35] py-10 lg:w-[1140px] lg:rounded-[30px] lg:py-20">
        <Heading stroke={false} className="text-center text-3xl lg:text-6xl">
          $GARA tokenomics
        </Heading>
        <div className="m-auto mt-10 flex items-center justify-center p-4">
          <Image
            src={isMobile ? tokenomicsPie : tokenomicsGARY}
            alt="tokenomics"
            width={isMobile ? 500 : 800} // Example widths
            height={isMobile ? 500 : 800} // Example heights
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default Tokenomics
