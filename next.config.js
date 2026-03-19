const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Security headers are now handled in middleware.ts
  transpilePackages: ['@react-three/postprocessing', 'postprocessing'],
  webpack: (config, { isServer, webpack }) => {
    // Fixes npm packages that depend on the `buffer` module.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer'),
      };
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
