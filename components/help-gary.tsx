import { Heading } from "@/components/heading";
import { GarysRoadmap } from "@/components/garys-roadmap";
// import { BuyGara } from "@/components/buy-gara-widget/widget";
import Image from "next/image";
import { Widget } from "@/components/widget";

export const HelpGary = () => {
  return (
    <div className="flex flex-col justify-center">
      <div className="container mx-auto mt-20 flex flex-col items-center lg:mt-44">
        <Heading className="text-center text-6xl font-bold sm:text-[3.5rem]">
          Help Gary reach his goals
        </Heading>
        <Heading className="mt-10 text-center uppercase text-gary-light-blue">
          1 GARA sold = 1 vote
        </Heading>
      </div>

      <div className="container mx-auto mt-16 grid justify-center gap-8 lg:grid-cols-[1fr_auto] lg:justify-between">
        <GarysRoadmap />
        <div className="mt-20 lg:mt-0">
          <div className="sticky top-0">
            <Widget /> {/* Use the new widget */}
            
            {/* Ice Image */}
            <div className="absolute -bottom-[7.5rem] -left-3 h-[160px] w-[106%] hidden lg:block">
              <Image src="/images/ice_buy_gara.svg" fill alt="Ice Background" />
            </div>

            {/* Gary Image */}
            <div className="absolute -left-[150px] top-0 -z-10 hidden lg:block h-[363px] w-[324px]">
              <Image
                src="/images/help-gary/gary_buy_gara.png"
                fill
                alt="Gary Buy GARA"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
