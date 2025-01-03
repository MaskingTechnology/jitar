---
layout: doc

prev:
    text: Installation
    link: /introduction/installation

next:
    text: Building blocks
    link: /fundamentals/building-blocks
---

# Quick start

In this short guide, you'll learn Jitar's key concepts and experience the setup process. We'll start with creating a new project followed by a step-by-step explanation of the concepts.

## 1. Create a new project

The fastest way to get started is creating a new project with our CLI tool. We'll use the React template in this section, but you can also use one of our other templates: vue, svelte, solidjs, lit or jitar-only. Also, we use jitar-react as the project name, but feel free to use any other name.

```bash
npm create jitar@latest jitar-react -- --template=react
```

After the installation, run the commands that are prompted.

```bash
Done. Now run:

  cd jitar-react
  npm install
  npm run build
  npm run standalone
```

Now you should be able to access the application on [http://localhost:3000](http://localhost:3000){target="_blank"}

## 2. Add your functions

Functions are the main building blocks of Jitar applications. The created application already has one in the `src/domain` folder, so let's take a look.

```ts
// src/domain/sayHello.ts
export async function sayHello(name: string): Promise<string>
{
    return `Hello, ${name}!`
}
```

Looks like a normal function, right? The `async` might seem unnecessary, but is actually an important addition. The caller of the function does not know about its location. The function might be locally available, but can also be on another server. Making a function `async` ensures that it can be run, no matter where it resides.

Functions can be imported and called like any normal async function.

```ts
// src/webui/App.tsx
/* other imports */

import { sayHello } from '../domain/sayHello';

const message = await sayHello('World');

function App() { /* … */ }
```

Jitar will automatically provide a remote implementation if the function is not locally available.

::: info ADDITIONAL INFO
Besides functions there are more useful building blocks. You can find out more in the [FUNDAMENTALS section](../fundamentals/building-blocks.md).
:::

## 3. Configure what runs on the server

To tell Jitar if a function runs on the client or the server, the application is split into groups of modules, called segments. Each segment has its own configuration file. In the project we can find one in the `segments` folder.

```json
// segments/default.json
{
    "./domain/sayHello": { "sayHello": { "access": "public" } }
}
```

Segments are named, and their names are stored in the filename. In this case the segment is called ‘default’. The rest of the filename makes it a detectable segment configuration, because Jitar scans the project to find them.

Segment configurations work like the JavaScript module system. In this case we export the `sayHello` function from `./domain/sayHello` module file. Additionally we set the access level to public so it can be called from the client. The configuration can be extended by simply adding functions.

*Try yourself:* remove the function from the configuration and restart the application. Note that the client doesn't make a call to the server anymore.

::: info ADDITIONAL INFO
More detailed information about segments can be found in the [FUNDAMENtALS section](../fundamentals/building-blocks.md#segments).
:::

## 4. Run your application

Applications can be run in a single Jitar instance for development and multiple distributed Jitar instances in production.

Jitar provides multiple types of services that can be configured to fit your needs at any time. In the project we can find a configuration in the `services` folder for a single instance setup.

```json
// services/standalone.json
{
    "url": "http://127.0.0.1:3000",
    "standalone":
    {
        "segments": ["default"],
        "assets": ["index.html", "main.js", "App.js", "vite.svg", "assets/**/*"]
    }
}
```

Jitar creates segment bundles required to run the application in any setup. By default the bundles will be stored in the `.jitar` folder, but you can configure another folder if desired.

Jitar can also act like a web server to serve the frontend components. By default it serves the `index.html` file when no specific file is requested, but you can configure another file. For [security reasons](../develop/security.md#file-access-protection), all assets must be specified in order to become accessible.

With everything in place we can run the application with the following command.

```bash
jitar start --service=services/standalone.json
```

The project provides a script containing the command in the `package.json` file, so we can also start Jitar like this:

```bash
npm run standalone
```

## What's next?

Congratulations, you now know the basics of Jitar! Check out the FUNDAMENTALS section for more information on the [building blocks](../fundamentals/building-blocks.md) for building applications and the [runtime services](../fundamentals/runtime-services.md) for running them.

If you want to learn how to build great applications with Jitar, you can check out the [DEVELOP section](../develop/application-structure.md).

More information on the deploying Jitar applications can be found in the [DEPLOY section](../deploy/segmentation.md) section.
