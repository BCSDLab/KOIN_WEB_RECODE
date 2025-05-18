/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      svgr({ include: '**/*.svg' }),
      tsconfigPaths(),
      sentryVitePlugin({
        org: 'bcsdlab',
        project: 'koin',
        url: 'https://glitchtip.bcsdlab.com/',
        release: {
          name: 'koin@0.1.0',
          uploadLegacySourcemaps: {
            paths: ['./build/assets'],
            urlPrefix: '~/assets',
          },
        },
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
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
  };
});
