import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"
import { locales as globalLocales } from "@/config"
import { defineRouting } from "next-intl/routing"

const locales = globalLocales

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound()
  return {
    messages: (await import(`./public/locales/${locale}/common.json`)).default,
    now: new Date(),
    timeZone: "Europe/Prague",
  }
})

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "de"],
  // Used when no locale matches
  defaultLocale: "en",
})
