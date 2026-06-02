
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
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
    react(),
    jitar(jitarConfig)
  ]
});
