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
      org: 'bugsinkhasnoorgs',
      project: 'ignored',
      authToken: 'b2a60872048b8bb33988bd711ec13e805361733a',
      url: 'https://bugsink.bcsdlab.com/',
      sourcemaps: {
        assets: 'assets/**',
      },
      release: {
        name: 'bugsink-release',
        inject: true,
        create: true,
        finalize: true,
      },
    })],
  resolve: {
    alias: {
      utils: '/src/utils',
    },
  },
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
    outDir: 'build',
  },
  define: { global: 'window' },
});
