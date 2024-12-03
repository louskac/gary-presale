import Image from "next/image"
import { useState, useEffect } from "react"
import { Heading } from "./heading"
import { Button } from "./ui/button"

export const Footer = () => {
  return (
    <footer className="m-auto w-full pb-10 pt-20">
      <div className="!m-auto w-[95%] lg:m-0 lg:flex lg:w-[85%]">
        <div className="left lg:flex lg:gap-8">
          <div className="m-auto w-[50%] lg:m-0 lg:w-[30%]">
            <Image src={`/images/ice.png`} alt="Ice" width={740} height={187} className="mt-4 object-contain" />
          </div>
          <div className="mt-5 lg:mt-0 lg:text-left">
            <Heading className="text-center text-2xl font-bold lg:text-left" stroke={false}>
              Join Gary&apos;s army
            </Heading>
            <p className="text-bold lg-px text-center text-xl text-white lg:w-[350px] lg:text-left">
              Show your support for Gary and his penguin family, and follow Gary on social media!
            </p>
            <div className="lg:justify-left m-auto mt-8 flex flex-row justify-center gap-2 md:gap-4 lg:m-0 lg:mt-5 lg:justify-normal">
              <Button className="aspect-square h-auto w-full max-w-[72px] rounded-full border-none bg-[#061023] hover:!bg-gary-yellow">
                <a
                  href="https://www.facebook.com/profile.php?id=61568221981440"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={`/images/save-penguins/facebook.svg`} width={42} height={42} alt="Facebook" />
                </a>
              </Button>
              <Button className="aspect-square h-auto w-full max-w-[72px] rounded-full border-none bg-[#061023] hover:!bg-gary-yellow">
                <a href="https://x.com/Help_Gary_" target="_blank" rel="noopener noreferrer">
                  <Image src={`/images/save-penguins/twitter.svg`} width={30} height={30} alt="Twitter" />
                </a>
              </Button>
              <Button className="aspect-square h-auto w-full max-w-[72px] rounded-full border-none bg-[#061023] hover:!bg-gary-yellow">
                <a href="https://t.me/helpgary" target="_blank" rel="noopener noreferrer">
                  <Image src={`/images/save-penguins/telegram.svg`} width={34} height={34} alt="Telegram" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="menu mt-10 lg:mt-0"></div>
        <div className="right text-center text-lg">
          <div className="text-white lg:text-left">
            <p className="font-bold">Coingarage s.r.o.</p>
            <p>Revoluční 1082/8, Nové Město (Praha 1),</p>
            <p>110 00 Prague, Czech Republic</p>
          </div>
          <div className="text-gary-yellow lg:text-left">
            <a href="mailto:support@helpgary.com" className="underline">
              support@helpgary.com
            </a>
          </div>
        </div>
      </div>
      <div className="text-md mt-10 text-center text-white">
        <p>
          &copy; 2024 All Rights Reserved by <strong>HELP{"\u00A0"}GARY</strong>
        </p>
      </div>
    </footer>
  )
}
