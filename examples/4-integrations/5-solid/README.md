# solidjs-jitar

The example contains a step-by-step guide to integrate Jitar with SolidJS using Vite.

## Step 1: Setup a SolidJS Project

Vite doesn't have a solidjs template available OOTB. There is a template for Solid and Typescript available using degit.For creating the SolidJS app, install degit and run the following command.

```bash
npx degit solidjs/templates/ts solidjs-jitar
cd solidjs-jitar
npm install
npm run dev
```

When opening http://localhost:3000/ in a web browser it should show the SolidJS logo.

Next, the app will be extended by adding a simple function that generates a welcome message. To hook Jitar later in the app, a shared folder needs to be created in the src folder. This folder holds all components that are shared between the client and server.

```bash
cd src
mkdir shared
```

Now, the first shared function needs to be created. Call it `sayHello` and give it the following content.

```ts
// src/shared/sayHello.ts
export async function sayHello(name: string): Promise<string>
{
    return `Hello, ${name}!`;
}
```

Note that this function is async. This is an important addition that makes the function distributable across the network.

Use this function to welcome you. To do so, the await block will be used. Update the `App.tsx` file to use the new function. This is a very simple example but feel free to extend it.

```tsx
import solidjslogo from './logo.svg';
import type { Component } from 'solid-js';
import { createResource } from 'solid-js';
import { sayHello } from './shared/sayHello';

const sayHelloResource = async () => {
  return await sayHello('Vite + Solid + Jitar');
}

const App: Component = () => {
  const [message] = createResource(sayHelloResource);

  return (
    <>
        <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
        <img src={solidjslogo} class="logo solid" alt="Solid logo" />
        </a>
        <h1>{ message }</h1>
    </>
  );
};

export default App;
```

The Vite logo is not available in this project. Copy the Vite logo from any other example and place it in the public folder in the root of the project.

Now the style needs to be updated to show the logos side by side. The `index.css` file needs to be updated.

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

#root {
  text-align: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.lit:hover {
  filter: drop-shadow(0 0 2em #325cffaa);
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
}
```

After saving the files, the browser should show the welcome message.

The function currently lives and runs on the client. Next, it will be moved to the server without touching a single line of code.

## Step 2: Add Jitar to the Project

To use Jitar as runtime, add its Node.js server as a dependency.

```bash
npm install jitar-nodejs-server
```

For easy integration with web apps, a Vite plugin is available.

```bash
npm install --save-dev jitar-vite-plugin
```

To enable the plugin, it needs to be added to the Vite config file.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import jitar from 'jitar-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    solidPlugin(),
    jitar('src', 'shared', 'http://localhost:3000')
  ],
  build: {
    target: 'esnext',
  }
})
```

The three parameters set the `root source` folder, the shared components folder (relative to the root folder), and the URL of the Jitar server.

Vite is now all set up, time for the configuration of Jitar. For this, two JSON files are required. The first is the server configuration. This simple example doesn’t need the [cluster options](https://docs.jitar.dev/03_runtime_services) provided by Jitar, so a simple standalone setup will be used. Create a new file in the project root (outside the source root) with the name jitar.json and the following content:

```json
{
    "url": "http://127.0.0.1:3000",
    "standalone":
    {
        "source": "./dist",
        "cache": "./cache",
        "index": "index.html",
        "assets": ["index.html", "vite.svg", "assets/**/*"]
    }
}
```

This configuration tells Jitar to read the compiled JavaScript from the dist folder and write its `cache` to the cache folder. It serves the `index.html` file when accessing it with a web browser. The `assets` whitelist the files that are accessible from the outside world. Other files will be hidden by default.

The second configuration is a [segment configuration](https://docs.jitar.dev/04_basic_features#segmentation). A segment defines the components grouped to form a deployable package. For example, you only need a single segment to place the function on the server. Create a new file in the project root with the name `server.segment.json` and the following content.

```ts
{
    "./shared/sayHello.js": { "sayHello": { "access": "public" } }
}
```

The structure of a segment file is very similar to the JavaScript module system. In this case, Jitar imports `sayHello` from `./shared/sayHello.js`. Additionally, the access is set to public (private by default).

Note that the file path is relative to the source root of the application and that it imports the compiled JavaScript file (ends with .js).

That’s almost it. The only thing that’s missing is a bootstrapper for starting a Jitar server. For this, add a new code file to the source root folder. Here’s what that looks like:

```ts
// src/jitar.ts
import { startServer } from 'jitar-nodejs-server';

const moduleImporter = async (specifier: string) => import(specifier);

startServer(moduleImporter);
```

With the start of a server, Jitar needs a module importer that imports Node dependencies from the local application context instead of the Jitar context.

## Step 3: Build and Run

With Jitar all set up, get ready for its first run. The current plugin implementation requires some additional configuration which will be optimised in later versions.

The `tsconfig.js` file needs to be updated with the following properties.

```js
/* tsconfig.json */
{
    "compilerOptions":
    {
        /* other properties */
        "noEmit": false, /* update this property */
        "outDir": "dist", /* add this property */
    },
    "include": ["src/**/*.ts"], /* update this property */
}
```

In the package.json file, the build script needs to be updated to include the TypeScript compiler. This is required to compile the Jitar bootstrapper and the shared functions.

```json
"build": "vite build && tsc",
```

Also, add the following script for starting the Jitar server.

```json
"jitar": "node --experimental-network-imports --experimental-fetch dist/jitar.js --config=jitar.json"
```

Lastly, add the type of the project.
```json
"type": "module"
```

And that's it. The server has been configured and is ready to go. Both scripts can be executed with the following commands:

```bash
npm run build
npm run jitar
```

Note that the function has been registered successfully by Jitar. This means that it has moved from the client to the server. Run the app by navigating to http://localhost:3000/. The Jitar log should indicate that it has run our function.

When inspecting the network traffic of the browser (in the developer tools), an API request to the server should be visible, indicating that the function is called from the server.

Congratulations! The app just executed a fully automated API. From here, the app can be extended with more functions.

Note that port 3000 is running the deployable version of the app. It’s also possible to start Vite in dev mode by running `npm run dev` again. Keep in mind that Jitar needs to run in the background. Otherwise, the server functions won’t be available.
