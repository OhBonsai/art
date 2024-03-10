import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  plugins: [
      react(),
      glsl()
  ],
  base: "/art",
  build: {
    outDir: "docs/dist"
  }
})
