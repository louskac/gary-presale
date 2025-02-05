"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AnchorLink } from "./anchor-link";

const marqueeText = `$GARA presale is LIVE | Initial price $0.12 | Listing price $0.36 | Estimated future price: $10 – $20`;

const getMarqueeJSX = () => {
  const parts = marqueeText.split(/(LIVE|\$0\.12|\$0\.36|\$10 – \$20)/); // Regex to match the dynamic parts to be bold
  return parts.map((part, index) =>
    /LIVE|\$0\.12|\$0\.36|\$10 – \$20/.test(part) ? (
      <strong key={index} className="font-bold">
        {part}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};

const links = [
  { name: "Goals", anchor: "garys-goals" },
  { name: "Earn", anchor: "earn" },
  { name: "Roadmap", anchor: "roadmap" },
  { name: "Tokenomics", anchor: "tokenomics" },
  { name: "Team", anchor: "ourteam" },
  { name: "Save penguins", anchor: "save" },
  { name: "FAQ", anchor: "faq" },
];

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarHandlerScroll = scrolled ? "lg:bg-[#061022]" : "bg-transparent";

  return (
    <>
      {/* Infinite Marquee */}
      <div className="w-full fixed bg-gary-yellow py-2 z-[9999]">
        <div className="relative overflow-hidden whitespace-nowrap">
          <div className="animate-marquee text-sm text-black">
            {Array(10)
              .fill(getMarqueeJSX())
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

              <Button className="h-12 w-12 flex items-center justify-center rounded-full border-none bg-[#1D1D1D] hover:!bg-gary-yellow transition-transform duration-200 hover:scale-110">
                <a href="https://discord.gg/helpgarywin" target="_blank" rel="noopener noreferrer">
                  <Image
                    src={`/images/save-penguins/discord.svg`}
                    width={28}
                    height={28}
                    alt="Telegram"
                    className="transition-transform duration-200 scale-125 hover:scale-125"
                  />
                </a>
              </Button>
            </div>
            <AnchorLink anchor="hero">
              <Button className="ml-4 border-2 border-transparent bg-gary-yellow px-6 text-lg text-black shadow-[0px_5px_0px_#D29200] hover:border-gary-yellow hover:bg-white hover:text-gary-yellow rounded-full">
                Buy $GARA coin
              </Button>
            </AnchorLink>
          </div>
        </div>
      </div>

      {/* Burger Menu Button */}
      <div className="fixed right-4 top-12 z-[9999]">
        <button className="focus:outline-none lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#061022]">
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
                <AnchorLink anchor={link.anchor}>
                  <span className="text-lg font-bold text-white" onClick={() => setMenuOpen(false)}>
                    {link.name}
                  </span>
                </AnchorLink>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <AnchorLink anchor="hero">
              <Button
                className="my-1 h-12 border-2 border-transparent bg-gary-yellow px-8 text-lg text-white shadow-[0px_5px_0px_#D29200] rounded-full outline-none transition-all hover:border-gary-yellow hover:bg-white hover:text-black"
                onClick={() => setMenuOpen(false)}
              >
                Buy $GARA coin
              </Button>
            </AnchorLink>
          </div>
        </div>
      )}
    </>
  );
};
