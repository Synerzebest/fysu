// next.config.js ou next.config.ts
import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['mugpnlsqeqbojnzrfnjf.supabase.co'],
  },
};

export default nextConfig;
