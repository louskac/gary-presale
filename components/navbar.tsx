"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AnchorLink } from "./anchor-link"

const links = [
  { name: "Goals", anchor: "garys-goals" },
  { name: "Earn", anchor: "earn" },
  { name: "Roadmap", anchor: "roadmap" },
  { name: "Tokenomics", anchor: "tokenomics" },
  { name: "Team", anchor: "ourteam" },
  { name: "Save penguins", anchor: "save" },
  { name: "FAQ", anchor: "faq" },
  { name: "Audit", href: "/whitepaper/WhitepaperCG.pdf" },
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
      {/* NavBar in 1440px Grid */}
      <div
        className={`z-[9999] fixed top-0 left-0 right-0 w-full transform transition-all ${navbarHandlerScroll}`}
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

      {/* Burger Menu Button (Mobile) */}
      <div className="fixed right-4 top-4 z-[9999] lg:hidden">
        <button className="focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#061022]">
            {menuOpen ? (
              <Image src="/icons/close.svg" alt="Close" width={24} height={24} />
            ) : (
              <Image src="/icons/burger-menu.svg" alt="Menu" width={24} height={24} />
            )}
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9998] flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-90">
          <div className="my-8">
            <Image src="/logo.png" alt="Gary" width={75} height={75} />
          </div>

          <ul className="flex flex-col gap-4 text-center">
            {links.map((link) => (
              <li key={link.name}>
                {link.href ? (
                  <a href={link.href} target="_blank" className="text-lg font-bold text-white" onClick={() => setMenuOpen(false)}>
                    {link.name}
                  </a>
                ) : (
                  <AnchorLink anchor={link.anchor}>
                    <span className="text-lg font-bold text-white" onClick={() => setMenuOpen(false)}>
                      {link.name}
                    </span>
                  </AnchorLink>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <AnchorLink anchor="garys-goals">
              <Button
                className="my-1 h-12 border-2 border-transparent bg-gary-pink px-8 text-lg text-white shadow-md hover:border-gary-pink hover:bg-white hover:text-gary-pink"
                onClick={() => setMenuOpen(false)}
              >
                Buy $GARA coin
              </Button>
            </AnchorLink>
          </div>

          <div className="mt-8 flex flex-row gap-4">
            <Button className="h-14 w-14 flex items-center justify-center rounded-full border-none bg-[#0D1E35] hover:!bg-gary-yellow transition-colors duration-200">
              <a href="https://www.facebook.com/profile.php?id=61568221981440">
                <Image
                  src={`/images/save-penguins/facebook.svg`}
                  width={32} 
                  height={32}
                  alt="Facebook"
                  className="flex-none object-contain transition-transform duration-200 hover:scale-125"
                />
              </a>
            </Button>

            <Button className="h-14 w-14 flex items-center justify-center rounded-full border-none bg-[#0D1E35] hover:!bg-gary-yellow transition-colors duration-200">
              <a href="https://x.com/Help_Gary_">
                <Image
                  src={`/images/save-penguins/twitter.svg`}
                  width={32} 
                  height={32}
                  alt="Twitter"
                  className="flex-none object-contain transition-transform duration-200 hover:scale-125"
                />
              </a>
            </Button>

            <Button className="h-14 w-14 flex items-center justify-center rounded-full border-none bg-[#0D1E35] hover:!bg-gary-yellow transition-colors duration-200">
              <a href="https://t.me/helpgary">
                <Image
                  src={`/images/save-penguins/telegram.svg`}
                  width={32} 
                  height={32}
                  alt="Telegram"
                  className="flex-none object-contain transition-transform duration-200 hover:scale-125"
                />
              </a>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
