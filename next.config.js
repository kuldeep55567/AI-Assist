/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to allow server components and API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
