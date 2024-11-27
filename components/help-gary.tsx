import { Heading } from "@/components/heading";
import { GarysRoadmap } from "@/components/garys-roadmap";
// import { BuyGara } from "@/components/buy-gara-widget/widget";
import Image from "next/image";
import { Widget } from "@/components/widget";

export const HelpGary = () => {
  return (
    <div className="flex flex-col justify-center">
      <div className="container mx-auto mt-20 flex flex-col items-center lg:mt-44">
        <Heading className="text-center tetx-3xl sm:text-6xl font-bold sm:text-[3.5rem]">
          Help Gary reach his goals
        </Heading>
        <Heading className="mt-10 text-center uppercase text-gary-light-blue text-2xl">
          1 GARA sold = 1 vote
        </Heading>
      </div>
d
      {/* Adjusting order for mobile */}
      <div className="container mx-auto grid justify-center gap-8 lg:grid-cols-[1fr_auto] lg:justify-between">
        {/* Widget First on Mobile */}
        <div className="order-1 lg:order-2 mt-10 lg:mt-0">
          <div className="sticky top-0">
            <Widget />
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

        {/* Roadmap Second on Mobile */}
        <div className="order-2 lg:order-1">
          <GarysRoadmap />
        </div>
      </div>
    </div>
  );
};
