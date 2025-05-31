
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import jitar from '@jitar/plugin-vite';

export default defineConfig({
  build: {
    emptyOutDir: false
  },
  plugins: [
    vue(),
    jitar({ sourceDir: 'src', targetDir: 'dist', jitarDir: 'domain', jitarUrl: 'http://localhost:3000', segments: [] })
  ]
});
