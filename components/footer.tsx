import Image from "next/image"
import { Heading } from "./heading"
import { Button } from "./ui/button"

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0D1E35] pb-10 pt-20">
      {/* Centered Content */}
      <div className="mx-auto w-full max-w-[1440px] px-6">
        {/* Grid Layout for Content */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Side: Ice Image + Social Links */}
          <div className="flex flex-col items-center lg:flex-row lg:gap-8">
            {/* Ice Image */}
            <div className="w-[50%] max-w-[300px] lg:w-[30%]">
              <Image src={`/images/ice.png`} alt="Ice" width={740} height={187} className="object-contain" />
            </div>

            {/* Text + Social Links */}
            <div className="mt-5 text-center lg:mt-0 lg:text-left">
              <Heading className="text-2xl font-bold text-white" stroke={false}>
                Join Gary&apos;s army
              </Heading>
              <p className="text-xl text-white lg:w-[350px]">
                Show your support for Gary and his penguin family, and follow Gary on social media!
              </p>

              {/* Social Links */}
              <div className="mt-8 flex flex-row justify-center gap-3 lg:mt-5 lg:justify-start">
                <Button className="flex h-16 w-16 items-center justify-center rounded-full border-none bg-[#0D1E35] hover:!bg-gary-yellow transition-transform duration-200 hover:scale-125">
                  <a href="https://www.facebook.com/profile.php?id=61568221981440" target="_blank" rel="noopener noreferrer">
                    <Image src={`/images/save-penguins/facebook.svg`} width={42} height={42} alt="Facebook" />
                  </a>
                </Button>
                <Button className="flex h-16 w-16 items-center justify-center rounded-full border-none bg-[#0D1E35] hover:!bg-gary-yellow transition-transform duration-200 hover:scale-125">
                  <a href="https://x.com/Help_Gary_" target="_blank" rel="noopener noreferrer">
                    <Image src={`/images/save-penguins/twitter.svg`} width={30} height={30} alt="Twitter" />
                  </a>
                </Button>
                <Button className="flex h-16 w-16 items-center justify-center rounded-full border-none bg-[#0D1E35] hover:!bg-gary-yellow transition-transform duration-200 hover:scale-125">
                  <a href="https://t.me/helpgary" target="_blank" rel="noopener noreferrer">
                    <Image src={`/images/save-penguins/telegram.svg`} width={34} height={34} alt="Telegram" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side: Address & Contact */}
          <div className="text-center text-lg text-white lg:text-left">
            <p className="font-bold">Coingarage s.r.o.</p>
            <p>Revoluční 1082/8, Nové Město (Praha 1),</p>
            <p>110 00 Prague, Czech Republic</p>
            <div className="mt-2 text-gary-yellow">
              <a href="mailto:support@helpgary.com" className="underline">
                support@helpgary.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-10 text-center text-white">
        <p>
          &copy; 2024 All Rights Reserved by <strong>HELP{"\u00A0"}GARY</strong>
        </p>
      </div>
    </footer>
  )
}
