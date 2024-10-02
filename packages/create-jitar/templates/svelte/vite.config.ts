import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import jitar from '@jitar/plugin-vite'

export default defineConfig({
  build: {
    emptyOutDir: false,
  },
  plugins: [
    svelte(),
    jitar({ sourceDir: 'src', targetDir: 'dist', jitarDir: 'domain', jitarUrl: 'http://localhost:3000', segments: [] })
  ],
});
