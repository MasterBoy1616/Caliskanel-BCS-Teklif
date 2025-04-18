import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: "/", // bu kalacak zaten doğru
  root: './',
  server: mode === "development" ? {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    }
  } : undefined,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
