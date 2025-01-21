import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/*', // Root base for custom domain like https://kinscreen.com
  plugins: [react()],
  optimizeDeps: {
    exclude: [], 
  },
});
