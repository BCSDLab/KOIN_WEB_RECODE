import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), svgr({ include: '**/*.svg' }), tsconfigPaths()],
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
  },
});
