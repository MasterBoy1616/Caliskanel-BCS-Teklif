// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // deploy için gerekli
  server: {
    proxy: {
      "/api": "http://localhost:8000", // local çalıştırırken backend bağlantısı
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
