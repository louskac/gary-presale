"use client"

import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl"
// import { MetaMaskProvider } from "@metamask/sdk-react"
import { WalletProviders } from "@/components/buy-gara-widget/wallet-providers"

type ProvidersProps = {
  children: React.ReactNode
  locale: string
  messages: AbstractIntlMessages
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <WalletProviders locale={locale}>{children}</WalletProviders>
        </NextIntlClientProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
