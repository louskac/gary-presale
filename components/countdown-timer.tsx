"use client"

import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

//monda
const endDate = 1740787199
const firstRoundEndDate = 1735689599
const secondRoundEndDate = 1738367999
// import { sepolia} from "wagmi/chains"
// const sepoliaRpcUrl = "https://eth-sepolia.g.alchemy.com/v2/vbBKw_KLTIW6P9CvewSXZrgbaAlhcg9r"
// const sepoliaProvider = new ethers.providers.JsonRpcProvider(sepoliaRpcUrl);
// const contractAddress = '0x20bc0Bf18ea3BCEb49c84c16655b5850eCAcf2ab';
// const contractAbi = [
//   {
//     "inputs": [{ "internalType": "address", "name": "_tokenAddress", "type": "address" },
//     { "internalType": "uint256", "name": "_startSaleDate", "type": "uint256" },
//     { "internalType": "uint256", "name": "_endSaleDate", "type": "uint256" },
//     { "internalType": "uint256", "name": "_firstRoundEndDate", "type": "uint256" }, { "internalType": "uint256", "name": "_secondRoundEndDate", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor"
//   },
//   {
//     "anonymous": false,
//     "inputs": [{ "indexed": false, "internalType": "uint256", "name": "startSaleDate", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "endSaleDate", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "firstRoundEndDate", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "secondRoundEndDate", "type": "uint256" }], "name": "SaleDateUpdated", "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newBalance", "type": "uint256" }], "name": "TokenBalanceUpdated", "type": "event"
//   },
//   {
//     "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
//     { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokensSoldUpdated", "type": "event"
//   },
//   { "inputs": [], "name": "endSaleDate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
//   { "inputs": [], "name": "firstRoundEndDate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
//   { "inputs": [], "name": "getEndSaleDate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
//   { "inputs": [], "name": "getStartSaleDate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
//   { "inputs": [], "name": "getTokenBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
//   { "inputs": [], "name": "getfirstRoundEndDate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
//   { "inputs": [], "name": "getsecondRoundEndDate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
//   { "inputs": [{ "internalType": "address", "name": "buyer", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "handleTokenPurchase", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
//   { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "secondRoundEndDate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_newOwner", "type": "address" }], "name": "setOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_startSaleDate", "type": "uint256" }, { "internalType": "uint256", "name": "_endSaleDate", "type": "uint256" }, { "internalType": "uint256", "name": "_firstRoundEndDate", "type": "uint256" }, { "internalType": "uint256", "name": "_secondRoundEndDate", "type": "uint256" }], "name": "setSaleDate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }], "name": "setToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "startSaleDate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "tokensSoldPerUser", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalTokensSold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "vaultContractAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "_token", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "withdrawToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
// ]
// async function readContractFunction() {
//   const contract = new ethers.Contract(contractAddress, contractAbi, sepoliaProvider);

//   try {
//     const endDate = await contract.getEndSaleDate();
//     const firstRoundEndDate = await contract.firstRoundEndDate();
//     const secondRoundEndDate = await contract.secondRoundEndDate();
//     if( Number(Number(new Date().getTime()/1000).toFixed(0)) < Number(firstRoundEndDate.toString())){
//       return Number(firstRoundEndDate.toString())
//     }else if(Number(Number(new Date().getTime()/1000).toFixed(0)) < Number(secondRoundEndDate.toString())){
//       return Number(secondRoundEndDate.toString())
//     }else if(Number(Number(new Date().getTime()/1000).toFixed(0)) < Number(endDate.toString())){
//       return Number(endDate.toString())
//     }else{
//       return 0
//     }
//   } catch (error) {
//     console.error('Error reading contract function:', error);
//   }
// }
const CountdownTimer = ({ className }: { className?: string }) => {
  const t = useTranslations("GARA.garaDepo.timer")
  const currentTime = new Date().getTime()
  let targetDate = new Date().getTime()
  // Set the target date/time
  if (firstRoundEndDate * 1000 > Number(currentTime)) {
    targetDate = firstRoundEndDate
  } else if (secondRoundEndDate * 1000 > Number(currentTime)) {
    targetDate = secondRoundEndDate
  } else if (endDate * 1000 > Number(currentTime)) {
    targetDate = endDate
  }
  // const targetDate = new Date("2024-12-31T23:59").getTime()

  // State to hold remaining time
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Function to calculate the time difference
  const calculateTimeLeft = () => {
    const now = new Date().getTime()
    const difference = targetDate * 1000 - now

    const days = Math.floor(Number(difference) / (1000 * 60 * 60 * 24))
    const hours = Math.floor((Number(difference) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((Number(difference) % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((Number(difference) % (1000 * 60)) / 1000)

    setTimeLeft({ days, hours, minutes, seconds })
  }

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => calculateTimeLeft(), 1000)
    return () => clearInterval(timer) // Cleanup timer
  }, [])

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      {/* Days */}
      <div className="flex w-[64px] flex-col items-center rounded-xl bg-gary-blue p-2 font-heading shadow-md md:min-w-[80px] lg:w-[74px]">
        <div className="text-lg font-bold text-gary-yellow md:text-xl">{String(timeLeft.days).padStart(2, "0")}</div>
        <div className="text-xs font-bold text-white md:text-sm">{t("day")}</div>
      </div>

      {/* Hours */}
      <div className="text-xl font-bold text-secondary">:</div>

      <div className="flex w-[64px] flex-col items-center rounded-xl bg-gary-blue p-2 font-heading shadow-md md:min-w-[80px] lg:w-[74px]">
        <div className="text-lg font-bold text-gary-yellow md:text-xl">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="text-xs font-bold text-white md:text-sm">{t("hours")}</div>
      </div>

      {/* Minutes */}
      <div className="text-xl font-bold text-secondary">:</div>

      <div className="flex w-[64px] flex-col items-center rounded-xl bg-gary-blue p-2 font-heading shadow-md md:min-w-[80px] lg:w-[74px]">
        <div className="text-lg font-bold text-gary-yellow md:text-xl">
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <div className="text-xs font-bold text-white md:text-sm">{t("minutes")}</div>
      </div>

      {/* Seconds */}
      <div className="text-xl font-bold text-secondary">:</div>

      <div className="flex w-[64px] flex-col items-center rounded-xl bg-gary-blue p-2 font-heading shadow-md md:min-w-[80px] lg:w-[74px]">
        <div className="text-lg font-bold text-gary-yellow md:text-xl">
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
        <div className="text-xs font-bold text-white md:text-sm">{t("seconds")}</div>
      </div>
    </div>
  )
}

export default CountdownTimer
