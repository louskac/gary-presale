import { useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server"; // Ensure server usage
import type { Metadata } from "next";
import { Baloo_Bhai_2 } from "next/font/google";
import { Providers } from "@/app/[locale]/providers";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import Script from "next/script";

const balooBhai = Baloo_Bhai_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--baloo-bhai",
});

export const metadata: Metadata = {
  title: "Save penguin Gary!",
  description: "Help to save Gary and his job",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale("en");
  const messages = useMessages("en");

  return (
    <html lang="en" className="overflow-hidden">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SK1L5K78GF"
        />
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SK1L5K78GF');
            `,
          }}
        />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NBHQJ87K');
            `,
          }}
        />
      </head>
      <body
        className={`${balooBhai.variable} overflow-hidden antialiased`}
        suppressHydrationWarning
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NBHQJ87K"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Providers locale="en" messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
