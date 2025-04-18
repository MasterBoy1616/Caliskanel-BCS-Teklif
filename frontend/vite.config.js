import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/",  // Burası eklendi!
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    }
  },
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

