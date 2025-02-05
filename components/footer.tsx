import Image from "next/image"
import { Heading } from "./heading"
import { Button } from "./ui/button"

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0D1E35] py-16">
      {/* Centered Content */}
      <div className="mx-auto w-full max-w-[1440px] px-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          {/* Column : Penguin Image */}
          <div className="flex justify-center">
            <Image src={`/images/ice.png`} alt="Ice" width={240} height={187} className="object-contain" />
          </div>

          {/* Column 2: Join Gary's Army */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Heading className="mb-4 text-2xl font-bold text-white" stroke={false}>
              Join Gary&apos;s army
            </Heading>
            <p className="mb-6 text-lg text-white">
              Show your support for Gary and his penguin family, and follow Gary on social media!
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <Button className="h-14 w-14 flex items-center justify-center rounded-full bg-[#1D1D1D] hover:bg-gary-yellow transition-transform hover:scale-110 !border-none outline-none">
                <a href="https://www.facebook.com/profile.php?id=61568221981440" target="_blank" rel="noopener noreferrer">
                  <Image src={`/images/save-penguins/facebook.svg`} width={24} height={24} alt="Facebook" className="scale-125" />
                </a>
              </Button>
              <Button className="h-14 w-14 flex items-center justify-center rounded-full bg-[#1D1D1D] hover:bg-gary-yellow transition-transform hover:scale-110 !border-none outline-none">
                <a href="https://x.com/Help_Gary_" target="_blank" rel="noopener noreferrer">
                  <Image src={`/images/save-penguins/twitter.svg`} width={24} height={24} alt="Twitter" />
                </a>
              </Button>
              <Button className="h-14 w-14 flex items-center justify-center rounded-full bg-[#1D1D1D] hover:bg-gary-yellow transition-transform hover:scale-110 !border-none outline-none">
                <a href="https://t.me/helpgary" target="_blank" rel="noopener noreferrer">
                  <Image src={`/images/save-penguins/telegram.svg`} width={24} height={24} alt="Telegram" />
                </a>
              </Button>
              <Button className="h-14 w-14 flex items-center justify-center rounded-full bg-[#1D1D1D] hover:bg-gary-yellow transition-transform hover:scale-110 !border-none outline-none">
                <a href="https://discord.gg/helpgarywin" target="_blank" rel="noopener noreferrer">
                  <Image src={`/images/save-penguins/discord.svg`} width={24} height={24} alt="Telegram" className="scale-125" />
                </a>
              </Button>
            </div>
          </div>

          {/* Column 3: Contact Information */}
          <div className="text-center text-white md:text-left">
            <p className="mb-2 font-bold text-lg">Coingarage s.r.o.</p>
            <p>Revoluční 1082/8, Nové Město (Praha 1),</p>
            <p>110 00 Prague, Czech Republic</p>
            <p className="mt-4 text-gary-yellow">
              <a href="mailto:support@helpgary.com" className="underline">
                support@helpgary.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-10 text-center text-white">
        <p>
          &copy; 2024 All Rights Reserved by <strong>HELP GARY</strong>
        </p>
      </div>
    </footer>
  )
}