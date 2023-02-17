# react-jitar

In this example you will learn how to integrate Jitar with React using Vite.

## Step 1: Setup a React Project

For creating the React app, use Vite with the `react-ts` template.

```bash
npm create -y vite@latest react-jitar -- --template react-ts
cd react-jitar
npm install
npm run dev
```

When opening http://localhost:5173/ in a web browser, you should see the Vite and React logos.

Next, you'll extend the app by adding a simple function that generates a welcome message. To hook Jitar later in the app, you need to create a shared folder in the src folder. This folder holds all components that are shared between the client and server.

```bash
cd src
mkdir shared
```

Now, you can add the first shared function. Call it `sayHello` and give it the following content.

```ts
// src/shared/sayHello.ts
export async function sayHello(name: string): Promise<string>
{
    return `Hello, ${name}!`;
}
```

Note that this function is async. This is an important addition that makes the function distributable across the network.

Use this function to welcome you. The function can be called directly from any React component. You’ll use the App component for now. Below is a simplified version of the generated component for this example, but feel free to make your own implementation.

```tsx
// src/App.tsx
import './App.css'
import { sayHello } from './shared/sayHello'

const message = await sayHello('React + Jitar')

function App()
{
    return (
        <div className="App">
        <h1>{message}</h1>
        </div>
    )
}

export default App
```

After saving the file, you should see our new message in the browser. For simplification, React hooks are avoided by creating the message outside the component. Calling the function from a hook will also work fine.

The function currently lives and runs on the client. Next, you move it to the server without touching a single line of code.

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
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jitar from 'jitar-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    jitar('src', 'shared', 'http://localhost:3000') // Add this
  ]
})
```

The three parameters set the `root source` folder, the shared components folder (relative to the root folder), and the URL of the Jitar server.

Vite is now all set up, so you can configure Jitar. For this, you need two JSON files. The first is the server configuration. This simple example doesn’t need the [cluster options](https://docs.jitar.dev/03_runtime_services) provided by Jitar, so you’ll create a simple standalone setup. Create a new file in the project root (outside the source root) with the name jitar.json and the following content:

```json
{
    "url": "http://127.0.0.1:3000",
    "standalone":
    {
        "source": "./dist",
        "cache": "./cache",
        "index": "index.html",
        "assets": ["index.html", "main.js", "App.js", "vite.svg", "assets/**/*"]
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

The structure of a segment file is very similar to the JavaScript module system. In this case, jitar imports `sayHello` from `./shared/sayHello.js`. Additionally, the access is set to public (private by default).

Note that the file path is relative to the source root of the application and that it imports the compiled JavaScript file (ends with .js).

That’s almost it. The only thing that’s missing is a bootstrapper starting a Jitar server. You need to add a new code file to the source root folder. Here’s what that looks like:

```ts
// src/jitar.ts
import { startServer } from 'jitar-nodejs-server';

const moduleImporter = async (specifier: string) => import(specifier);

startServer(moduleImporter);
```

With the start of a server, you need to provide a module importer that imports Node dependencies from the local application context instead of the Jitar context.

## Step 3: Build and Run

With Jitar all set up, you can get ready for its first run. For this, you need to modify the `tsconfig.js` file to output all compiled JavaScript to the dist folder.

```json
/* tsconfig.json */
{
    "compilerOptions":
    {
        /* other properties */
        "noEmit": false, /* default true, change to false */
        "outDir": "dist", /* add this property */
    }
}
```

You also need to modify the package.json file and reverse the order of the build script to make sure that our shared components are available after the Vite build process.

```json
"build": "vite build && tsc",
```

Lastly, you can add the following script for starting the Jitar server.

```json
"jitar": "node --experimental-network-imports --experimental-fetch dist/jitar.js --config=jitar.json"
```

Now you’re all done and ready to go. You can test both scripts with the following commands:

```bash
npm run build
npm run jitar
```

Note that our function has been registered successfully by Jitar. This means that it has moved from the client to the server. You can check this by opening our app again at http://localhost:3000/. The Jitar log should indicate that it has run our function.

When inspecting the network traffic of the browser (in the developer tools), you should also see that it has sent an API request to the server.

Congratulations! You’ve just made your fully automated API. From here, the app can be extended with more functions.

Note that you’re now running the deployable version of the app. It’s also possible to start Vite in dev mode by running `npm run dev` again. Keep in mind that Jitar needs to run in the background. Otherwise, the server functions won’t be available.
