// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,

  async rewrites() {
    return [
      // Frontend her zaman /backend/... çağırır, Next bunu sabit backend’e taşır.
      {
        source: "/backend/:path*",
        destination: "https://api.yenigunemlak.com/:path*",
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.yenigunemlak.com", pathname: "/public/**" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
