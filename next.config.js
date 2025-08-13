/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // --- ADD THIS WEBPACK CONFIGURATION ---
  webpack: (config, { isServer }) => {
    // This tells Next.js to not bundle `canvas` on the server.
    if (isServer) {
      config.externals.push('canvas');
    }
    return config;
  },
  // ------------------------------------
};

module.exports = nextConfig;