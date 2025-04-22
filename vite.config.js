import { defineConfig } from 'vite';

export default defineConfig({
  root: './frontend',
  build: {
    outDir: '../backend/dist',
    emptyOutDir: true,
  },
});
