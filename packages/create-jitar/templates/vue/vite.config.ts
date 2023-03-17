
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jitar from 'jitar-vite-plugin'

export default defineConfig({
  plugins: [
    vue(),
    jitar('src', 'shared', 'http://localhost:3000')],
})
