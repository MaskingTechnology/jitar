import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import jitar from '@jitar/plugin-vite'

export default defineConfig({
  plugins: [
    solidPlugin(),
    jitar({ sourceDir: 'src', targetDir: 'dist', jitarDir: 'domain', jitarUrl: 'http://localhost:3000', segments: [] })
  ],
  build: {
    emptyOutDir: false,
    target: 'esnext',
  }
})