const isProd = process.env.NODE_ENV === 'production';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers are now handled in middleware.ts
};

export default withBundleAnalyzer(nextConfig);
