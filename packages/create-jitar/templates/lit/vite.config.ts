import { defineConfig } from 'vite'
import jitar from '@jitar/plugin-vite'

export default defineConfig({
  build: {
    emptyOutDir: false
  },
  plugins: [
    jitar({ sourceDir: 'src', targetDir: 'dist', jitarDir: 'domain', jitarUrl: 'http://localhost:3000', segments: [] })
  ]
})