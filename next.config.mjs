// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,

  async redirects() {
    return [
      {
        source: "/ads/:uid",
        destination: "/ilan/:uid",
        permanent: true,
      },
    ];
  },

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
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
