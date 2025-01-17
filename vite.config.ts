import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { defineConfig } from 'vite';

import manifest from './public/manifest.config';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    crx({
      manifest,
      contentScripts: {
        injectCss: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
