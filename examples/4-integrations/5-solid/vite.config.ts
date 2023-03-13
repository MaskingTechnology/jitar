// vite.config.ts
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import jitar from 'jitar-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    solidPlugin(),
    jitar('src', 'shared', 'http://localhost:3000')
  ],
  build: {
    target: 'esnext',
  }
})