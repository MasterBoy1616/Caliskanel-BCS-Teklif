import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/",  // Bu satır çok önemli! CSS ve JS için
  server: {
    proxy: {
      '/api': 'http://localhost:8000', 
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
