---
layout: doc

prev:
    text: RPC API
    link: /integrate/rpc-api

next:
    text: Logging
    link: /monitor/logging

---

# Vite plugin

For easy integration with popular frontend frameworks like React, Angular, Vue, etc. we provide a plugin for [Vite](https://vitejs.dev/){target="_blank"}.

Note: we also provide a creator app with templates for the most used frameworks. We recommend checking this out first before using this plugin. More information can be found in [our quick start](../introduction/quick-start).

## Installation

You can simply install the plugin as dev-dependency using NPM.

```bash
npm install --save-dev @jitar/vite-plugin
```

Next it has to be added to the Vite config file.

```ts
// vite.config.js
import { defineConfig } from 'vite';
import jitar from '@jitar/plugin-vite';

export default defineConfig({
  plugins: [
	jitar(srcPath, jitarPath, jitarUrl, [segments])
  ]
});
```

The plugin takes 4 arguments:

1. srcPath - The path to the app source files. In most cases this is the `src` folder.
1. jitarPath - The path to the source files used by Jitar. This path is relative to the source root. We like to use `shared` (which points to `src/shared`), * but feel free to use something else.
1. jitarUrl - The URL of the Jitar instance. Jitar uses by default `http://localhost:3000`, but can be configured differently in the Jitar config.
1. segments - The segments to use for the client app. This is an array of strings. The default is an empty array.

There are also a few requirements for the tsconfig.json file

```json
{
    "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "noEmit": false,
        "outDir": "dist"
    }
}
```

Finally, the TypeScript compilation needs to be set as the last step in the package.json file.

```json
{
    "build": "vite build && tsc",
}
```

This makes sure all TypeScript is compiled in ESNext format and placed in the dist folder that Jitar uses as input for creating its cache.

## Usage

For development you can run Vite as you would normally do. The only requirement is that an instance of Jitar must already run in the background. For production you can build the project and use Jitar as your web server.

Important: Jitar currently doesn’t support hot reloads. This means that the Jitar server needs to get restarted every time the backend functions are created or updated.
