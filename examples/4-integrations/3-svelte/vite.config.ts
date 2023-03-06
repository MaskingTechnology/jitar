import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import jitar from 'jitar-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    jitar('src', 'shared', 'http://localhost:3000')
  ],
})