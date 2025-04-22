import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: '../backend/dist',
    emptyOutDir: true
  }
})
