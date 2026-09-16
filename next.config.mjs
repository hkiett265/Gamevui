/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents double mounting WebGL canvases in dev
  transpilePackages: ['three']
};

export default nextConfig;
