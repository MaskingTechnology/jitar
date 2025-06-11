
# Jitar Plugin for Vite

This plugin allows you to use [Vite](https://vitejs.dev/) to build your [Jitar](https://jitar.dev/) app.

## Installation

```bash
npm install --save-dev @jitar/vite-plugin
```

## Usage

The plugin needs to be added to the vite config file.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import jitar, { JitarConfig } from '@jitar/plugin-vite'

const jitarConfig: JitarConfig = {
  sourceDir: 'src',
  targetDir: 'dist',
  jitarDir: 'domain',
  jitarUrl: 'http://localhost:3000',
  segments: [],
  middleware: []
}

export default defineConfig({
  plugins: [
    jitar(jitarConfig)
  ]
})
```

The plugin takes 6 arguments:

* **sourceDir** - The folder containing the app’s source files. In most cases, this is the `src` folder.
* **targetDir** - The folder where the app’s distribution files are output. In most cases, this is the `dist` folder.
* **jitarDir** - The folder containing the source files used by Jitar. This path is relative to the source root. We typically use `domain` (which refers to `src/domain`), but feel free to use a different path.
* **jitarUrl** - The URL of the Jitar instance. By default, Jitar uses `http://localhost:3000`, but this can be changed in the Jitar configuration.
* **segments** - The segments to use for the client app. This should be an array of strings. The default value is an empty array.
* **middleware** - The middleware to use for the client app. This should be an array of strings. The default value is an empty array.
