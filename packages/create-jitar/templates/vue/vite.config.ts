import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jitar from '@jitar/plugin-vite'

export default defineConfig({
  plugins: [
    vue(),
    jitar('src', 'domain', 'http://localhost:3000')],
})