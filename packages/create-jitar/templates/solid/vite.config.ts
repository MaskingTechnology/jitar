import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import jitar from '@jitar/plugin-vite'

export default defineConfig({
  plugins: [
    solidPlugin(),
    jitar('src', 'shared', 'http://localhost:3000')
  ],
  build: {
    target: 'esnext',
  }
})