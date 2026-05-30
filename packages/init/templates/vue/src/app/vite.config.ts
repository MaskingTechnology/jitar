
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import jitar, { JitarConfig } from '@jitar/plugin-vite';

const jitarConfig: JitarConfig = {
  projectRoot: '../../',
  sourceRoot: '../',
  jitarUrl: 'http://localhost:3000',
  segments: [],
  middleware: []
};

export default defineConfig({
  root: './src/app',
  publicDir: 'public',
  build: {
    outDir: '../../dist/app',
    emptyOutDir: true
  },
  plugins: [
    vue(),
    jitar(jitarConfig)
  ]
});
