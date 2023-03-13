import { resolve } from 'path'
import { defineConfig } from 'vite'
import jitar from 'jitar-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) =>
{
  return {
    plugins: [
      jitar('src', 'shared', 'http://localhost:3000')
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
  }
})
