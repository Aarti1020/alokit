import path from "path";

/** @type {import('next').NextConfig} */
const backendOrigin = process.env.BACKEND_ORIGIN || "http://localhost:5000";

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    return [
     {
  source: "/assets/:path*",
  destination: `${backendOrigin}/assets/:path*`,
},
      {
        source: "/media/:path*",
        destination: `${backendOrigin}/media/:path*`,
      },
      {
        source: "/backend-proxy/public/assets/alokit/products/:path*",
        destination: `${backendOrigin}/public/assets/alokit/products/:path*`, // ✅ FIXED
      },
      {
        source: "/backend-proxy/public/media/alokit/:path*",
        destination: `${backendOrigin}/public/media/alokit/:path*`, // ✅ FIXED
      },
      {
        source: "/backend-proxy/:path*",
        destination: `${backendOrigin}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost", port: "3001" },
      { protocol: "http", hostname: "127.0.0.1", port: "3001" },
      { protocol: "http", hostname: "localhost", port: "5000" },
      { protocol: "http", hostname: "127.0.0.1", port: "5000" },
    ],
  },
};

export default nextConfig;
