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

::: tip
We think it's good to put all the frontend code in a separate folder for better separation of concerns. It also simplifies the build process. For this, we use the `webui` folder throughout the documentation. 
:::

::: info NOTE
We also provide a creator app with templates for the most used frameworks. We recommend checking this out first before using this plugin. More information can be found in [our quick start](../introduction/quick-start).
:::

## Installation

You can simply install the plugin as dev-dependency using NPM.

```bash
npm install --save-dev @jitar/plugin-vite
```

Next it has to be added to the Vite config file.

```ts
// vite.config.js
import jitar, { JitarConfig } from '@jitar/plugin-vite';
import { defineConfig } from 'vite';

const JITAR_URL = 'http://localhost:3000';
const JITAR_SEGMENTS = ['frontend'];
const JITAR_MIDDLEWARES = ['./requesterMiddleware'];

const jitarConfig: JitarConfig = {
  sourceDir: 'src',
  targetDir: 'dist',
  jitarDir: 'domain',
  jitarUrl: JITAR_URL,
  segments: JITAR_SEGMENTS,
  middleware: JITAR_MIDDLEWARES
};

export default defineConfig({
  publicDir: 'src/webui/public',
  build: {
    assetsDir: 'webui',
    emptyOutDir: false
  },
  plugins: [
    jitar(jitarConfig)
  ]
});
``` 

The plugin configuration has 6 parameters:

1. sourceDir - The directory of the app source files. In most cases this is the `src` folder.
1. targetDir - The directory of the output folder of the Vite build. This is the folder that Jitar uses as input for creating its cache.
1. jitarDir - The directory of the source files used by Jitar. This path is relative to the source root. We like to use `domain` (which points to `src/domain`), but feel free to use something else.
1. jitarUrl - The URL of the Jitar instance. Jitar uses by default `http://localhost:3000`, but can be configured differently.
1. segments - The segments to use for the client app. This is an array of strings. The default is an empty array.
1. middlewares - The middlewares to use for calling remote procedures. This is an array of strings. The default is an empty array.

To build the segments, an additional tsconfig file is required to compile the source code. The configuration is also used to exclude the `webui` folder from the TypeScript compilation.

```json
// tsconfig.jitar.json
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "noEmit": false,
        "rootDir": "./src",
        "outDir": "./dist"
    },
    "include": ["src"],
    "exclude": ["src/webui"]
}
```

Finally, the TypeScript compilation needs to be set as the last step in the package.json file.

```json
{
    "build": "npm run build-domain && npm run build-webui",
    "build-domain": "rm -rf dist && tsc -p tsconfig.jitar.json && jitar build",
    "build-webui": "vite build",
}
```

::: tip
Checkout our demo project [Comify](https://github.com/MaskingTechnology/comify){target="_blank"} for a complete working setup.
:::

## Usage

For development you can run Vite as you would normally do. The only requirement is that an instance of Jitar must already run in the background. For production you can build the project and use Jitar as your web server.

::: info IMPORTANT
Jitar currently doesn’t support hot reloads. This means that the Jitar server needs to get restarted every time the backend functions are created or updated.
:::
