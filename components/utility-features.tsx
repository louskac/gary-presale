"use client";

import { FC } from "react";
import Image from "next/image";
import { Heading } from "@/components/heading";
import { Button } from "./ui/button";

interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: "Utility-Backed Growth",
    description:
      "$GARA has real use cases on the European exchange Coingarage as payment for fees and platform features.",
  },
  {
    title: "Fuel for trading apps",
    description:
      "Coingarage’s trading apps makes several trades per user daily and will consume $GARA for every trade.",
  },
  {
    title: "Ongoing $GARA Burning",
    description:
      "Every month, 20% of $GARA from fees is burned until only 200M remain from the original 900M.",
  },
];

function renderDescription(description: string): JSX.Element {
  return (
    <>
      {description
        .split(/(payment for fees|consume \$GARA for every trade.|burned until only 200M)/)
        .map((part, index) =>
          /payment for fees|consume \$GARA for every trade.|burned until only 200M/.test(
            part
          ) ? (
            <strong key={index} className="font-bold">
              {part}
            </strong>
          ) : (
            part
          )
        )}
    </>
  );
}

const handleClick = (url: string) => {
  window.open(url, "_blank");
};

const UtilityFeatures: FC = () => {
  return (
    <section className="pb-20">
      <Heading className="text-5xl font-bold text-gary-yellow text-center">
        $GARA utility on Coingarage exchange
      </Heading>
      <div className="relative pt-20 mt-[450px]">
        <div
          className="absolute -top-96 left-[calc(50%+520px)] bg-gary-yellow text-black text-center px-10 py-2 text-lg font-thin rounded-2xl z-10 animate-pop"
        >
          <span className="text-4xl font-black">100x</span>
          <br />
          potential
        </div>

        {/* Gary Peak Image - Correct Positioning */}
        <div className="absolute -top-60 left-[calc(50%-750px)] -z-20">
          <Image
            src="/images/gary-peak.png"
            alt="Peaking"
            width={400}
            height={600}
            className="object-cover"
          />
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[88%] w-[1200px] h-auto -z-10">
          <Image
            src="/images/trade.webp"
            alt="Trading Background"
            width={1200}
            height={600}
            className="object-cover"
          />
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-6 text-white">
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 relative">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-3xl bg-[#0D1E35] p-8 text-center"
              >
                <Heading className="mb-4 text-2xl font-bold text-gary-yellow text-center">
                  <span
                    style={{
                      WebkitTextStroke: "0px hsl(var(--gary-blue))",
                      paintOrder: "fill",
                    }}
                  >
                    {feature.title}
                  </span>
                </Heading>
                <p className="text-lg text-white">{renderDescription(feature.description)}</p>
              </div>
            ))}
          </div>
          {/* Centering the Button and Green Flashing Text */}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-10 space-y-3">
        <Button
          variant="default"
          size="lg"
          className="h-14 border-2 border-transparent bg-gary-yellow px-10 text-2xl text-black shadow-[0px_5px_0px_#D29200] rounded-full outline-none transition-all sm:hover:border-gary-yellow sm:hover:bg-white sm:hover:text-black dark:sm:hover:bg-white dark:sm:hover:text-black"
          onClick={() => {
             handleClick("https://coingarage.io");
          }}
        >
          Visit Coingarage
        </Button>
        <div className="flex items-center mt-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-[#02F577]"></div>
          <span className="ml-2 text-lg font-semibold text-[#02F577]">The exchange is live</span>
        </div>
      </div>
    </section>
  );
};

export default UtilityFeatures;