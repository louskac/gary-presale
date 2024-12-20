"use client"
//monda
const endDate = 1740787199
const firstRoundEndDate = 1735689599
const secondRoundEndDate = 1738367999
const calculateRound = () => {
  const currentTime = new Date().getTime()
  if (firstRoundEndDate * 1000 > Number(currentTime)) {
    return 1
  } else if (secondRoundEndDate * 1000 > Number(currentTime)) {
    return 2
  } else if (endDate * 1000 > Number(currentTime)) {
    return 3
  }
}
export function Rounds() {
  return (
    <div className="mx-2">
      <div className="my-2 flex w-full flex-row justify-center gap-2">
        {Number(calculateRound()) === Number(1) ? (
          <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-[#0D1E35] px-6 py-2 text-center">
            <p className="text-xs font-bold leading-none text-white">
              1<sup>st</sup> round
            </p>
            <p className="text-lg font-bold leading-none text-gary-yellow">$0.10</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-gary-input-blue px-6 py-2 text-center">
            <p className="text-xs font-bold leading-none text-[#0D1E35]">
              1<sup>st</sup> round
            </p>
            <p className="text-lg font-bold leading-none text-gary-pink">$0.10</p>
          </div>
        )}

        {Number(calculateRound()) === Number(2) ? (
          <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-[#0D1E35] px-6 py-2 text-center">
            <p className="text-xs font-bold leading-none text-white">
              2<sup>nd</sup> round
            </p>
            <p className="text-lg font-bold leading-none text-gary-yellow">$0.12</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-gary-input-blue px-6 py-2 text-center">
            <p className="text-xs font-bold leading-none text-[#0D1E35]">
              2<sup>nd</sup> round
            </p>
            <p className="text-lg font-bold leading-none text-gary-pink">$0.12</p>
          </div>
        )}

        {Number(calculateRound()) === Number(2) ? (
          <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-[#0D1E35] px-6 py-2 text-center">
            <p className="text-xs font-bold leading-none text-white">
              3<sup>rd</sup> round
            </p>
            <p className="text-lg font-bold leading-none text-gary-yellow">$0.15</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-gary-input-blue px-6 py-2 text-center">
            <p className="text-xs font-bold leading-none text-[#0D1E35]">
              3<sup>rd</sup> round
            </p>
            <p className="text-lg font-bold leading-none text-gary-pink">$0.15</p>
          </div>
        )}
      </div>

      <div className="my-2 flex w-full flex-row justify-center">
        <div className="bg-gary-green mt-2 flex flex-1 flex-col items-center gap-1 rounded-xl bg-[#88FFD5] px-6 py-2">
          <p className="text-md font-bold leading-none text-[#0D1E35]">Listing</p>
          <p className="text-xl font-bold leading-none text-gary-pink">$0.20</p>
        </div>
      </div>
    </div>
  )
}
