import createNextIntlPlugin from "next-intl/plugin"

const redeploy = 0.1

const withNextIntl = createNextIntlPlugin()

const nextConfig = {
  images: {
    domains: ["flagcdn.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1338",
      },
      {
        protocol: "https",
        hostname: "coinicons-api.vercel.app",
        port: "",
      },
      {
        protocol: "https",
        hostname: "trade.coingarage.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "via.assets.so",
        port: "",
      },
      {
        protocol: "https",
        hostname: "graceful-hope-03323ffb1e.media.strapiapp.com",
        port: "",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Add SVG loader
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    })

    // Resolve fallbacks
    config.resolve.fallback = { fs: false, net: false, tls: false }

    // Exclude specific packages from the build
    config.externals.push("pino-pretty", "lokijs", "encoding")

    return config
  },
}

export default withNextIntl(nextConfig)
