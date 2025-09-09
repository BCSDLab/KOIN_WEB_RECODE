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
              plugins: [
                { name: 'removeViewBox', active: false },
              ],
            },
          },
        },],
    });

    return config;
  },
  experimental: {
    workerThreads: false,
  },
  output: 'export',
  distDir: './dist', // Changes the build output directory to `./dist/`.
};

export default nextConfig;
