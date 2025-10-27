/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [],
            },
          },
        },],
    });

    return config;
  },
  experimental: {
    workerThreads: false,
  },
  images: { unoptimized: true },
  distDir: 'dist',
};

export default nextConfig;
