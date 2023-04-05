---
layout: default
title: Quickstart
---

# Quickstart

Initiating your Jitar journey is hassle-free with the Jitar NPM creator tool. This tool enables you to effortlessly create a new full-stack application that comes preloaded with support for popular front-end frameworks. In this quickstart guide, we will walk through the process of creating a simple Jitar application with React, using the intuitive features of the Jitar NPM creator tool. Let's dive in and get started with building your Jitar application with React!

```bash
> npm create jitar@latest jitar-react -- --template=react

Done. Now run:

  cd jitar-react
  npm install
  npm run build
  npm run jitar
```

Navigate to [localhost](http://localhost:3000) to see the application running.

{:.alert-info}
For all front-end development Jitar depends on [Vite](https://vitejs.dev) as a build tool.

To build your application, simply fire up Vite by running npm run dev in a separate terminal. It's important to note that Jitar should always be kept running in the background to ensure smooth operation of the backend functions. Letting Jitar run in the background is vital for seamless execution of the backend functionalities while you work on building out your application using Vite. Keep both Vite and Jitar up and running for a seamless development experience!

## Exploring the application

Upon inspection, you will quickly observe that the compiler's target has been designated as `esnext` in Jitar. This is due to Jitar's significant reliance on the ECMAScript module (ESM) system. As such, it has been configured to optimize for the latest ESM features and capabilities.

{:.filename}
tsconfig.json

```json
{
    "compilerOptions":
    {
        "target": "esnext",
        "module": "es2022",
        "moduleResolution": "node",
        "rootDir": "./src/",
        "outDir": "./dist",
        "skipLibCheck": true
    }
}
```

In Jitar, functions are utilized as procedures and can be created in the same way as regular functions. However, it's important to note that objects are not supported as procedures in Jitar. So, when designing procedures in Jitar, make sure to use functions rather than objects. This distinction is crucial to ensure smooth operation and compatibility with Jitar's procedural programming approach.

{:.filename}
src/shared/sayHello.ts

```ts
export default async function sayHello(name = 'World'): Promise<string>
{
    return `Hello ${name}`;
}
```

In Jitar, parameters for procedures can be either mandatory or optional. If a parameter is optional, it must be defined with a default value. These parameters will be checked when the procedure is called using the [RPC API](advanced-features.html#apis) to ensure they are properly provided.

The following segment file demonstrates the backend function configuration in Jitar. This configuration instructs the backend to load the "sayHello" file, retrieve the default export, and make it accessible via the RPC API. Segment files are utilized to group and distribute procedures, making them accessible on the backend. Jitar loads these segment files during application startup, ensuring that the procedures are available for execution.

{:.filename}
segments/server.segment.json

```json
{
    "./shared/sayHello.js": { "default": { "access": "public" } }
}
```

More information regarding segment configuration is described in the [segments section](basic-features.html#segments) of the basic features.

### Step 3 - Create an application starting point

To bootstrap Jitar, we need to create an application starting point. This involves creating a file that invokes Jitar's ``startServer`` or ``startClient`` hook. In this example, we will utilize the server hook. This starting point file serves as the entry point for launching Jitar and initiating the server-side functionalities.

{:.filename}
src/start.ts

```ts
import { startServer } from 'jitar-nodejs-server';

const moduleImporter = async(specifier: string) => import(specifier);

startServer(moduleImporter);
```

This setup can be used in most situations and is used in all our examples. More information about this hook can be found in the [hooks section](advanced-features.html#hooks) of the advanced features.

### Step 4 - Configure Jitar

To initiate a Jitar instance, configuration parameters are required to define its runtime behavior. The most straightforward approach is to run Jitar as a standalone instance, which necessitates minimal configuration.

{:.filename}
jitar.json

```json
{
    "url": "http://127.0.0.1:3000",
    "standalone": {
        "source": "./dist"
    }
}
```

In the [runtime services page](runtime-services.html) we will look at all the configuration options.
---

{:.next-chapter}
[Runtime services](runtime-services.html)
