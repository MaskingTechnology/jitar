import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jitar from 'jitar-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    jitar('src', 'shared', 'http://localhost:3000')
  ]
})
