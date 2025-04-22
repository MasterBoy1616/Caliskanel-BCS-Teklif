import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: '../backend/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
    },
  },
});
