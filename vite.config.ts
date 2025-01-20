import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/', // Root base for custom domain like https://kinscreen.com
  plugins: [react()],
  optimizeDeps: {
    exclude: [], 
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dist: resolve(__dirname, 'dist/index.html'),
      },
    },
  },
});