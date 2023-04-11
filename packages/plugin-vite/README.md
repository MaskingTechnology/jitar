
# Vite plugin for Jitar

This plugin allows you to use [Vite](https://vitejs.dev/) to build your [Jitar](https://jitar.dev/) app.

## Installation

```bash
npm install --save-dev jitar-vite-plugin
```

## Usage

The plugin needs to be added to the vite config file.

```js
// vite.config.js
import { defineConfig } from 'vite'
import jitar from '@jitar/plugin-vite'

export default defineConfig({
  plugins: [
    jitar(srcPath, jitarPath, jitarUrl, [segments])
  ]
})
```

The plugin takes 4 arguments:

* **srcPath** - The path to the app source files. In most cases this is the `src` folder.
* **jitarPath** - The path to the source files used by Jitar. This path is relative to the source root. We like to use `shared` (which points to `src/shared`), but feel free to use something else.
* **jitarUrl** - The URL of the Jitar instance. Jitar uses by default `http://localhost:3000`, but can be configured differently in the Jitar config.
* **segments** - The segments to use for the client app. This is an array of strings. The default is an empty array.
