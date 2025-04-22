import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../backend/dist", // Build dosyalarını backend içindeki dist'e atıyoruz
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
  },
});
