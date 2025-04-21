import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  base: '/', // Render için doğru base
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // Proxy tamamen kaldırıldı!
});
