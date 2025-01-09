"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CurrencySelect } from "./currency-select";

export const CoinInput = forwardRef<
  HTMLInputElement,
  {
    name: string;
    coin: string;
    placeholder?: string;
    type: string;
    readOnly?: boolean;
    className?: string;
    showIcon?: boolean;
    form?: any;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(({ coin, className, showIcon = true, form, error, ...rest }, ref) => {
  const formatToLocale = (value: string | number | undefined) => {
    if (value === undefined) return "";
    return new Intl.NumberFormat("en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(Number(value));
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex w-full items-center gap-3 sm:gap-4 rounded-full bg-gary-input-blue/40 px-4 sm:px-6 py-3 border border-gray-300 shadow-sm"
        )}
      >
        <input
          ref={ref}
          lang="en"
          min="0"
          className={cn(
            "flex-grow bg-transparent font-medium text-base sm:text-lg text-gray-800 outline-none placeholder-gray-400 appearance-none",
            className
          )}
          onChange={(e) => {
            const formattedValue = formatToLocale(e.target.value);
            e.target.value = formattedValue;
          }}
          {...rest}
        />
        {showIcon && (
          <div className="flex items-center gap-2">
            <Image
              src={`/icons/coins/${coin?.toLowerCase()}.png`}
              alt={coin}
              width={42}
              height={42}
            />
          </div>
        )}
        {form && <CurrencySelect form={form} />}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
});
