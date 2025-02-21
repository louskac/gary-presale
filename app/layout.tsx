import { useMessages } from "next-intl"
import { unstable_setRequestLocale } from "next-intl/server" // Ensure server usage
import type { Metadata } from "next"
import { Baloo_Bhai_2 } from "next/font/google"
import { Providers } from "@/app/[locale]/providers"
import "@rainbow-me/rainbowkit/styles.css"
import "./globals.css"
import Script from "next/script"

const balooBhai = Baloo_Bhai_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--baloo-bhai",
})

export const metadata: Metadata = {
  title: "Help penguin Gary!",
  description: "Help to save Gary and his job",
}

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  unstable_setRequestLocale("en")
  const messages = useMessages("en")

  return (
    <html lang="en" className="">
      <head>
        {/* Page Metadata */}
        <title>Save Penguin Gary!</title>
        <meta name="description" content="Help to save Gary and his job" />
        {/* OpenGraph Metadata */}
        <meta property="og:title" content="Save Penguin Gary!" />
        <meta property="og:description" content="Help to save Gary and his job" />
        <meta property="og:image" content="https://www.helpgary.com/images/share-image.png" /> {/* Full URL */}
        <meta property="og:url" content="https://www.helpgary.com" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Save Penguin Gary!" />
        <meta name="twitter:description" content="Help to save Gary and his job" />
        <meta name="twitter:image" content="https://www.helpgary.com/images/share-image.png" /> {/* Full URL */}
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-SK1L5K78GF" />
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
        {/* Facebook Pixels according to URL - fbq.getState().pixels  */}
        {/* fbq('track', 'PageView') is not called here, it is probably called for other 6 fb pixels in GTM   */}
        
        <Script
          id="facebook-pixel-1"
          dangerouslySetInnerHTML={{
            __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                if(window.location.search.includes('ref=t1')) {
                 fbq('init', '1444163449895758');
                }
                if(window.location.search.includes('ref=t2')) {
                 fbq('init', '923524003272405');
                }
                if(window.location.search.includes('ref=t3')) {
                 fbq('init', '640882395171206');
                }
                if(window.location.search.includes('ref=t4')) {
                 fbq('init', '925648596443532');
                }
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
        {/* Smartlook */}
        <Script
          id="smartlook-script"
          dangerouslySetInnerHTML={{
            __html: `
              window.smartlook||(function(d) {
                var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
                var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
                c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
              })(document);
              smartlook('init', '93d6b3147b56a59130397d2b41538ff0d6f8b009', { region: 'eu' });
            `,
          }}
        />
      </head>
      <body className={`${balooBhai.variable} antialiased`} suppressHydrationWarning>
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
  )
}
