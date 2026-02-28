const withNextIntl = require("next-intl/plugin")(
  // Specify the path to the request config
  "./i18n/request.ts"
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
}

module.exports = withNextIntl(nextConfig)
