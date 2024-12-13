"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AnchorLink } from "./anchor-link"

const links = [
  { name: "Gary's story", anchor: "about" },
  { name: "Help Gary", anchor: "help-gary" },
  { name: "Earn with Gary", anchor: "earn" },
  { name: "Join us!", anchor: "save" },
  { name: "FAQ", anchor: "faq" },
  { name: "WhitePaper", href: "/whitepaper/WhitepaperCG.pdf" },
]

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="container mx-auto w-full py-4 lg:grid lg:grid-cols-[200px_1fr_200px] lg:items-center lg:justify-between lg:gap-8">
      <div className="hidden h-14 w-14 rounded-full lg:block">
        <Image src="/logo.png" alt="Gary" width={60} height={60} />
      </div>

      <nav className="hidden lg:flex lg:justify-center">
        <ul className="flex flex-row gap-2">
          {links.map((link) => (
            <li key={link.name}>
              {link.href ? (
                <a href={link.href} target="_blank">
                  <Button variant="ghost" className="text-xl font-bold text-white">
                    {link.name}
                  </Button>
                </a>
              ) : (
                <AnchorLink anchor={link.anchor}>
                  <Button variant="ghost" className="text-xl font-bold text-white">
                    {link.name}
                  </Button>
                </AnchorLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="hidden lg:flex lg:items-center lg:justify-end">
        <AnchorLink anchor="help-gary">
          <Button className="my-2 h-14 border-2 border-transparent bg-gary-pink px-4 text-xl text-white shadow-md outline-none transition-all hover:border-gary-pink hover:bg-white hover:text-gary-pink dark:hover:bg-white dark:hover:text-gary-pink">
            Buy $GARA coin
          </Button>
        </AnchorLink>
      </div>
      {/* Burger Menu Button */}
      <button className="fixed right-4 top-4 z-50 focus:outline-none lg:hidden z-[9999]" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#061022]">
          {menuOpen ? (
            <Image src="/icons/close.svg" alt="Close" width={24} height={24} />
          ) : (
            <Image src="/icons/burger-menu.svg" alt="Menu" width={24} height={24} />
          )}
        </div>
      </button>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-90">
          <div className="mb-8">
            <Image src="/logo.png" alt="Gary" width={100} height={100} />
          </div>

          <ul className="flex flex-col gap-6 text-center">
            {links.map((link) => (
              <li key={link.name}>
                {link.href ? (
                  <a
                    href={link.href}
                    target="_blank"
                    className="text-2xl font-bold text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <AnchorLink anchor={link.anchor}>
                    <span className="text-2xl font-bold text-white" onClick={() => setMenuOpen(false)}>
                      {link.name}
                    </span>
                  </AnchorLink>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <AnchorLink anchor="help-gary">
              <Button
                className="my-2 h-14 border-2 border-transparent bg-gary-pink px-10 text-2xl text-white shadow-md outline-none transition-all hover:border-gary-pink hover:bg-white hover:text-gary-pink dark:hover:bg-white dark:hover:text-gary-pink"
                onClick={() => setMenuOpen(false)} // Close menu on click
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
    </div>
  )
}
