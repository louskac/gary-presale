"use client"

import React from "react"
import { Star } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn, formatAmount } from "@/lib/utils"

interface Step {
  votes: number
  title: string
  description: string
  img: string
}

interface VerticalProgressIndicatorProps {
  steps?: Step[]
  activeStep?: number
}

const garysRoadMapData = [
  {
    votes: 500000,
    title: "Unemployment compensation",
    description: "Gary will be still unemployed, but he won't starve.",
    img: "unenployment.png",
  },
  {
    votes: 1000000,
    title: "RESCUE OF PENGUINS",
    description:
      "GARY will be able to send part of all the money from the pre-sale to save his penguin family in Antarctica.",
    img: "rescue.png",
  },
  {
    votes: 2000000,
    title: "NEW JOB FOR GARY",
    description: "Gary will get new job in company and will be able to enforce at least 2 GARA airdrops.",
    img: "new_job.png",
  },
  {
    votes: 5000000,
    title: "GARY'S PROMOTION",
    description:
      "Gary will gain more influence in the company and push listing of GARA coin on selected exchanges in the top 50.",
    img: "promotion.png",
  },
  {
    votes: 10000000,
    title: "Seat on the board of directors",
    description:
      "GARY will use his influence in the company and list GARA coin on some of the top 10 crypto exchanges.",
    img: "board-member.png",
  },
  {
    votes: 30000000,
    title: "Taking over",
    description:
      "GARY will become king and gain control of the exchange Coingarage and rename it Coinguin. As the first act of his reign, he will burn 15% of the total supply of GARA coin.",
    img: "assumption.png",
  },
  {
    votes: 50000000,
    title: "SPREAD OF INFLUENCE",
    description:
      "GARY gains a huge influx of power and quickly expands his influence worldwide. He will use money from the pre-sale for marketing and development of new products which will use GARA coin.",
    img: "influence.png",
  },
]

export function GarysRoadmap({ steps = garysRoadMapData, activeStep = 0 }: VerticalProgressIndicatorProps) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between py-4 text-white">
      <div className="relative flex flex-col gap-8 p-5 sm:px-0">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-1 gap-6 last:mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hidden h-full w-16 lg:flex">
              <div className="relative flex flex-1 flex-row items-center justify-center">
                {index <= activeStep ? (
                  <motion.div
                    className={cn(
                      "absolute -top-8 left-7 w-2 bg-gary-light-blue",
                      index === 0 ? "-top-2 rounded-t-full" : "",
                      index === steps.length - 1 ? "rounded-b-full" : "",
                      activeStep === index ? "rounded-b-full" : ""
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: "120%" }}
                    transition={{
                      duration: 1.5,
                      ease: "linear",
                      stiffness: 0,
                      damping: 0,
                      delay: index * 1.5,
                    }}
                  />
                ) : null}
                <div
                  className={cn(
                    "absolute left-7 -z-20 h-[120%] w-2 bg-[#0D1E35]",
                    index === 0 ? "rounded-t-full" : "",
                    index === steps.length - 1 ? "rounded-b-full" : ""
                  )}
                ></div>
                <motion.div
                  className={`z-100 relative flex size-12 items-center justify-center rounded-full bg-[#0D1E35] ring-8 ${
                    index <= activeStep ? "ring-gary-light-blue" : "bg-[#0D1E35] ring-transparent"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.2 + 0.3,
                  }}
                >
                  {index <= activeStep ? (
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" fill="currentColor" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-slate-500" />
                  )}
                </motion.div>
              </div>
            </div>

            <div
              className={cn(
                "relative flex w-full max-w-full flex-col items-center justify-between rounded-3xl bg-[#0D1E35] pb-10 md:mb-0 md:max-w-[700px] lg:flex-row lg:pb-2",
                index <= activeStep && "border-4 border-gary-yellow"
              )}
            >
              {index <= activeStep && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 transform rounded-t-md bg-gary-yellow px-3 py-1 text-sm text-black">
                  Goal Reached
                </div>
              )}

              <motion.div
                className="flex w-full max-w-[620px] flex-col px-4 py-4 sm:px-8 sm:py-6 lg:w-full"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
              >
                <div className="text-lg font-bold text-gary-light-blue" suppressHydrationWarning>
                  {formatAmount(step.votes, 0)}
                </div>
                <h3 className="mb-2 text-lg font-bold uppercase text-gary-yellow sm:text-2xl">{step.title}</h3>
                <p className="text-lg font-bold">{step.description}</p>
              </motion.div>
              <motion.div
                className="relative mr-5 flex h-32 w-32 items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
              >
                <Image
                  src={`/images/help-gary/${step.img}`}
                  alt=""
                  fill
                  className="max-w-full object-contain"
                  sizes="(max-width: 768px) 100vw, 365px"
                  quality={100}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
