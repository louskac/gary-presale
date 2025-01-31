"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AnchorLink } from "./anchor-link"

const marqueeText = `$GARA presale is LIVE | Initial price $0.12 | Listing price $0.36`

const links = [
  { name: "Goals", anchor: "garys-goals" },
  { name: "Earn", anchor: "earn" },
  { name: "Roadmap", anchor: "roadmap" },
  { name: "Tokenomics", anchor: "tokenomics" },
  { name: "Team", anchor: "ourteam" },
  { name: "Save penguins", anchor: "save" },
  { name: "FAQ", anchor: "faq" },
]

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navbarHandlerScroll = scrolled ? "lg:bg-[#061022]" : "bg-transparent"

  return (
    <>
      {/* Infinite Marquee */}
      <div className="w-full fixed bg-gary-yellow py-2 z-[9999]">
        <div className="relative overflow-hidden whitespace-nowrap">
          <div className="animate-marquee text-sm font-bold text-black">
            {Array(10)
              .fill(marqueeText)
              .map((text, index) => (
                <span key={index} className="px-4">
                  {text}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* NavBar in 1440px Grid */}
      <div
        className={`z-[9999] fixed top-0 left-0 right-0 w-full transform transition-all mt-8 ${navbarHandlerScroll}`}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between py-4">
          {/* Logo */}
          <div className="h-14 w-14 flex-shrink-0 lg:block ml-4 md:ml-0">
            <AnchorLink anchor="home">
              <Image src="/logo.png" alt="Gary" width={60} height={60} />
            </AnchorLink>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex">
            <ul className="flex flex-row gap-4">
              {links.map((link) => (
                <li key={link.name}>
                  {link.href ? (
                    <a href={link.href} target="_blank">
                      <Button variant="ghost" className="text-lg font-bold text-white">
                        {link.name}
                      </Button>
                    </a>
                  ) : (
                    <AnchorLink anchor={link.anchor}>
                      <Button variant="ghost" className="text-lg font-bold text-white">
                        {link.name}
                      </Button>
                    </AnchorLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Social & Buy Button */}
          <div className="hidden lg:flex lg:items-center">
            <div className="flex flex-row gap-2">
              <Button className="h-12 w-12 flex items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow transition-transform duration-200 hover:scale-110">
                <a href="https://x.com/Help_Gary_" target="_blank" rel="noopener noreferrer">
                  <Image
                    src={`/images/save-penguins/twitter.svg`}
                    width={28} 
                    height={28} 
                    alt="Twitter"
                    className="transition-transform duration-200 hover:scale-125"
                  />
                </a>
              </Button>

              <Button className="h-12 w-12 flex items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow transition-transform duration-200 hover:scale-110">
                <a href="https://www.facebook.com/profile.php?id=61568221981440" target="_blank" rel="noopener noreferrer">
                  <Image
                    src={`/images/save-penguins/facebook.svg`}
                    width={32} 
                    height={32} 
                    alt="Facebook"
                    className="transition-transform duration-200 hover:scale-125 scale-125"
                  />
                </a>
              </Button>

              <Button className="h-12 w-12 flex items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow transition-transform duration-200 hover:scale-110">
                <a href="https://t.me/helpgary" target="_blank" rel="noopener noreferrer">
                  <Image
                    src={`/images/save-penguins/telegram.svg`}
                    width={28} 
                    height={28} 
                    alt="Telegram"
                    className="transition-transform duration-200 hover:scale-125"
                  />
                </a>
              </Button>
            </div>
          </div>
          <AnchorLink anchor="garys-goals">
            <Button className="ml-4 border-2 border-transparent bg-gary-pink px-6 text-lg text-white shadow-md hover:border-gary-pink hover:bg-white hover:text-gary-pink invisible md:visible">
              Buy $GARA coin
            </Button>
          </AnchorLink>
        </div>
      </div>
    </>
  )
}

/* Add the necessary CSS in your global styles (e.g., globals.css) */
<style jsx global>{`
  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .animate-marquee {
    display: inline-block;
    white-space: nowrap;
    animation: marquee 20s linear infinite;
  }
`}</style>
