import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: "./frontend",
  plugins: [react()],
  base: "/", // bu kesinlikle böyle olacak!
  build: {
    outDir: "../frontend/dist", // dikkat: parent seviyeye build alıyoruz
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
