import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/", // çok önemli!
  server: {
    proxy: {
      '/api': 'http://localhost:8000', // local geliştirme için proxy
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
