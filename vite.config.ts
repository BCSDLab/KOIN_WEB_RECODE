/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    svgr({ include: '**/*.svg' }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'bcsdlab',
      project: 'koin',
      url: 'https://glitchtip.bcsdlab.com/',
      release: {
        name: 'koin@.1.0',
        uploadLegacySourcemaps: {
          paths: ['./build/assets'],
          urlPrefix: '~/assets',
        },
      },
      authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      utils: '/src/utils',
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  define: { global: 'window' },
});
