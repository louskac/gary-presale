"use client"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"
import { useAccount } from "wagmi"
import { useEffect } from "react"

const ethTokens = [
  { label: "USDT", value: "USDT" },
  { label: "USDC", value: "USDC" },
  { label: "ETH", value: "ETH" },
  // { label: "SOL", value: "SOL" },
] as const
const bnbTokens = [
  { label: "USDT", value: "USDT" },
  { label: "USDC", value: "USDC" },
  { label: "BNB", value: "BNB" },
  // { label: "SOL", value: "SOL" },
] as const
const polTokens = [
  { label: "USDT", value: "USDT" },
  { label: "USDC", value: "USDC" },
  { label: "POL", value: "POL" },
  // { label: "SOL", value: "SOL" },
] as const

export function CurrencySelect({ form , currentNetworkId} ) {
  const { chain, address } = useAccount()
  useEffect(()=>{
    console.log("currentNetworkId", currentNetworkId)
  },[currentNetworkId])
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="token"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel></FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "!mt-0 h-[24px] w-full justify-between rounded-full border-none bg-transparent !p-0 font-bold text-gary-blue",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <Image
                      src={`/icons/coins/${field.value?.toLowerCase()}.png`}
                      alt={field.value}
                      width={32}
                      height={32}
                      className="mr-2"
                    />
                    <ChevronDown className="mr-4 h-8 w-8 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[150px] p-0">
                <Command>
                  {/* <CommandInput placeholder="Search token..." /> */}
                  <CommandList>
                    <CommandEmpty>No coin found.</CommandEmpty>
                    <CommandGroup>
                      {chain?.id === 1 &&
                        address &&
                        ethTokens.map((token) => (
                          <CommandItem
                            value={token.label}
                            key={token.value}
                            onSelect={() => {
                              form.setValue("token", token.value)
                            }}
                            className="text-white"
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", token.value === field.value ? "opacity-100" : "opacity-10")}
                            />

                            <Image
                              src={`/icons/coins/${token.value?.toLowerCase()}.png`}
                              alt={token.value}
                              width={20}
                              height={20}
                              className="mr-2"
                            />
                            {token.label}
                          </CommandItem>
                        ))}
                      {chain?.id === 137 &&
                        address &&
                        polTokens.map((token) => (
                          <CommandItem
                            value={token.label}
                            key={token.value}
                            onSelect={() => {
                              form.setValue("token", token.value)
                            }}
                            className="text-white"
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", token.value === field.value ? "opacity-100" : "opacity-10")}
                            />

                            <Image
                              src={`/icons/coins/${token.value?.toLowerCase()}.png`}
                              alt={token.value}
                              width={20}
                              height={20}
                              className="mr-2"
                            />
                            {token.label}
                          </CommandItem>
                        ))}
                      {chain?.id === 56 &&
                        address &&
                        bnbTokens.map((token) => (
                          <CommandItem
                            value={token.label}
                            key={token.value}
                            onSelect={() => {
                              form.setValue("token", token.value)
                            }}
                            className="text-white"
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", token.value === field.value ? "opacity-100" : "opacity-10")}
                            />

                            <Image
                              src={`/icons/coins/${token.value?.toLowerCase()}.png`}
                              alt={token.value}
                              width={20}
                              height={20}
                              className="mr-2"
                            />
                            {token.label}
                          </CommandItem>
                        ))}
                        
                       {currentNetworkId === 1 &&
                         !address &&
                         ethTokens.map((token) => (
                           <CommandItem
                             value={token.label}
                             key={token.value}
                             onSelect={() => {
                               form.setValue("token", token.value)
                             }}
                             className="text-white"
                           >
                             <Check
                               className={cn("mr-2 h-4 w-4", token.value === field.value ? "opacity-100" : "opacity-10")}
                             />
                            <Image
                               src={`/icons/coins/${token.value?.toLowerCase()}.png`}
                               alt={token.value}
                               width={20}
                               height={20}
                               className="mr-2"
                             />
                             {token.label}
                           </CommandItem>
                         ))}
                       {currentNetworkId === 137 &&
                         !address &&
                         polTokens.map((token) => (
                           <CommandItem
                             value={token.label}
                             key={token.value}
                             onSelect={() => {
                               form.setValue("token", token.value)
                             }}
                             className="text-white"
                           >
                             <Check
                               className={cn("mr-2 h-4 w-4", token.value === field.value ? "opacity-100" : "opacity-10")}
                             />
                            <Image
                               src={`/icons/coins/${token.value?.toLowerCase()}.png`}
                               alt={token.value}
                               width={20}
                               height={20}
                               className="mr-2"
                             />
                             {token.label}
                           </CommandItem>
                         ))}
                       {currentNetworkId === 56 &&
                         !address &&
                         bnbTokens.map((token) => (
                           <CommandItem
                             value={token.label}
                             key={token.value}
                             onSelect={() => {
                               form.setValue("token", token.value)
                             }}
                             className="text-white"
                           >
                             <Check
                               className={cn("mr-2 h-4 w-4", token.value === field.value ? "opacity-100" : "opacity-10")}
                             />
                            <Image
                               src={`/icons/coins/${token.value?.toLowerCase()}.png`}
                               alt={token.value}
                               width={20}
                               height={20}
                               className="mr-2"
                             />
                             {token.label}
                           </CommandItem>
                         ))} 
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
