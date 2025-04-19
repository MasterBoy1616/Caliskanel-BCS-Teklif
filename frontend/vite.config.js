import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // render için doğru base
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
