import { resolve } from 'path'
import { defineConfig } from 'vite'
import jitar from '@jitar/plugin-vite'

export default defineConfig(({ mode }) =>
{
  return {
    plugins: [
      jitar('src', 'domain', 'http://localhost:3000')
    ],
    build: {
      lib: {
        entry: 'src/my-element.ts',
        formats: ['es'],
      },
      rollupOptions: {
        external: mode === "production" ? "" : /^lit/,
        input: {
          main: resolve(__dirname, 'index.html'),
        }
      },
    },
  };
})