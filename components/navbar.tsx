"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AnchorLink } from "./anchor-link"

const links = [
  { name: "Gary's story", anchor: "about" },
  { name: "Help Gary", anchor: "help-gary" },
  { name: "Earn with Gary", anchor: "earn" },
  { name: "FAQ", anchor: "faq" },
  { name: "Join us!", anchor: "save" },
  { name: "Tokenomics", anchor: "tokenomics" },
  { name: "Roadmap", anchor: "roadmap" },
  { name: "WhitePaper", href: "/whitepaper/WhitepaperCG.pdf" },
]

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    // Add scroll listener
    window.addEventListener("scroll", handleScroll)

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navbarHandlerScroll = scrolled ? "lg:bg-[#061022]" : "bg-transparent"

  return (
    <>
      <div
        className={`z-[9999] hidden w-full transform items-center justify-around py-4 transition-all lg:fixed lg:flex px-28 ${navbarHandlerScroll}`}
      >
        <div className="hidden h-14 w-14 flex-shrink-0 rounded-full lg:block">
          <Image src="/logo.png" alt="Gary" width={60} height={60} />
        </div>

        <nav className="hidden lg:flex">
          <ul className="flex flex-row gap-2">
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

        <div className="hidden flex-shrink-0 lg:flex lg:items-center lg:justify-end">
          <div className="lg:justify-left m-auto mr-4 flex flex-row justify-center gap-2 md:gap-4 lg:justify-normal">
            <Button className="flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow">
              <a href="https://x.com/Help_Gary_" target="_blank" rel="noopener noreferrer">
                <Image
                  src={`/images/save-penguins/twitter.svg`}
                  width={32}
                  height={32}
                  alt="Twitter"
                  className="scale-[2]"
                />
              </a>
            </Button>
            <Button className="flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow">
              <a
                href="https://www.facebook.com/profile.php?id=61568221981440"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`/images/save-penguins/facebook.svg`}
                  width={32}
                  height={32}
                  alt="Facebook"
                  className="scale-[3]"
                />
              </a>
            </Button>
            <Button className="flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow">
              <a href="https://t.me/helpgary" target="_blank" rel="noopener noreferrer">
                <Image
                  src={`/images/save-penguins/telegram.svg`}
                  width={32}
                  height={32}
                  alt="Telegram"
                  className="scale-[2.5]"
                />
              </a>
            </Button>
          </div>
          <AnchorLink anchor="help-gary">
            <Button className="border-2 border-transparent bg-gary-pink px-4 text-xl text-white shadow-md outline-none transition-all hover:border-gary-pink hover:bg-white hover:text-gary-pink dark:hover:bg-white dark:hover:text-gary-pink">
              Buy $GARA coin
            </Button>
          </AnchorLink>
        </div>
      </div>

      {/* Burger Menu Button */}
      <div className="fixed right-4 top-4 z-[9999]">
        <button className="focus:outline-none lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#061022]">
            {menuOpen ? (
              <Image src="/icons/close.svg" alt="Close" width={24} height={24} />
            ) : (
              <Image src="/icons/burger-menu.svg" alt="Menu" width={24} height={24} />
            )}
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[9998] flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-black bg-opacity-90 pb-10 pt-10">
          <div className="my-8">
            <Image src="/logo.png" alt="Gary" width={75} height={75} />
          </div>

          <ul className="flex flex-col gap-4 text-center">
            {links.map((link) => (
              <li key={link.name}>
                {link.href ? (
                  <a
                    href={link.href}
                    target="_blank"
                    className="text-lg font-bold text-white"
                    onClick={() => setMenuOpen(false)}
                  >
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
            <AnchorLink anchor="help-gary">
              <Button
                className="my-1 h-12 border-2 border-transparent bg-gary-pink px-8 text-lg text-white shadow-md outline-none transition-all hover:border-gary-pink hover:bg-white hover:text-gary-pink dark:hover:bg-white dark:hover:text-gary-pink"
                onClick={() => setMenuOpen(false)}
              >
                Buy $GARA coin
              </Button>
            </AnchorLink>
          </div>
          <div className="mt-8 flex flex-row gap-4">
            <Button className="flex h-12 w-12 items-center justify-center rounded-full border-none bg-[#0D1E35] hover:!bg-gary-yellow">
              <a href="https://www.facebook.com/profile.php?id=61568221981440">
                <Image src={`/images/save-penguins/facebook.svg`} width={24} height={24} alt="Facebook" />
              </a>
            </Button>
            <Button className="flex h-12 w-12 items-center justify-center rounded-full border-none bg-[#0D1E35] hover:!bg-gary-yellow">
              <a href="https://x.com/Help_Gary_">
                <Image src={`/images/save-penguins/twitter.svg`} width={24} height={24} alt="Twitter" />
              </a>
            </Button>
            <Button className="flex h-12 w-12 items-center justify-center rounded-full border-none bg-[#0D1E35] hover:!bg-gary-yellow">
              <a href="https://t.me/helpgary">
                <Image src={`/images/save-penguins/telegram.svg`} width={24} height={24} alt="Telegram" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
