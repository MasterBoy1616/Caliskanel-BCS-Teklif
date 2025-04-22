import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // ÖNEMLİ: tüm dosyaları ./assets/ şeklinde yüklemesi için
  plugins: [react()],
  build: {
    outDir: '../backend/dist', // Build çıktısı backend/dist klasörüne atılacak
    emptyOutDir: true, // Build'den önce dist klasörünü temizler
  },
});
