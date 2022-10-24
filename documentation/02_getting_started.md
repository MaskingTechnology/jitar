---
layout: default
title: Getting started
---

# Getting started

Setting up Jitar is easy. In this section we help you get up and running.

---

## Prerequisites

Jitar requires Node.js version 18.7 or higher to be installed.

{:.alert-warning}
Running Jitar currently requires the *network imports* and *fetch api* experimental features.

{:.alert-info}
When working with TypeScript version 4.4.2 or higher is required.

---

## Installation

Jitar needs to be added as a NPM dependency to your application.

```bash
npm install jitar
```

Both JavaScript and TypeScript are supported by default.

{:.alert-info}
When working with TypeScript make sure that ES6 modules are generated as output (es2020 or es2022).

---

## Hello World

In this section we will setup a simple app that runs on Jitar. We use TypeScript for this and all other examples with the following configuration.

{:.filename}
tsconfig.json

```json
"compilerOptions":
{
  "target": "es2022",
  "module": "es2022",
  "moduleResolution": "node",
  "rootDir": "./src/",
  "outDir": "./dist"
}
```

If you don't want to use TypeScript you can use JavaScript instead by removing all the typing from the examples.

### Step 1 - Create a procedure

Jitar uses functions as procedures. They can be created like any normal function.

{:.filename}
src/greetings/sayHello.ts

```ts
export default async function sayHello(name = 'World'): Promise<string>
{
    return `Hello ${name}`;
}
```

Parameters can be mandatory or optional. Optional parameters need to be defined with a default value. The parameters will be checked when calling the procedure using the [RPC API](05_advanced_features#apis).

### Step 2 - Put the procedure in a segment

Segment files are used to group and distribute procedures. They are loaded by Jitar when the application starts.

{:.filename}
src/default.segment.json

```json
{
    "./greetings/sayHello.js": {
        "default": {
            "access": "public"
        }
    }
}
```

More information regarding segment configuration is described in the [segments section](04_basic_features#segments) of the basic features.

### Step 3 - Create an application starting point

For bootstrapping Jitar we need to create an application starting point. This is a file that calls Jitar's ``startServer`` or ``startClient`` hook. For this example we will use the server hook.

{:.filename}
src/start.ts

```ts
import { startServer } from 'jitar';

const moduleImporter = async(specifier: string) => import(specifier);

startServer(moduleImporter);
```

This setup can be used in most situations and is used in all our examples. More information about this hook can be found in the [hooks section](05_advanced_features#hooks) of the advanced features.

### Step 4 - Configure Jitar

When starting a Jitar instance we need to pass some configuration telling it how to run. The simplest option is to run Jitar as a standalone instance.

{:.filename}
jitar.json

```json
{
    "mode": "standalone",
    "url": "http://127.0.0.1:3000",
    "source": "./dist"
}
```

In the [runtime services page](03_runtime_services) we will look at all the configuration options.

### Step 5 - Run and test

First we need to add a run script to the ``package.json`` file.

{:.filename}
package.json

```json
{
    "name": "jitar-helloworld-example",
    "type": "module",
    "scripts": {
        "start": "node --experimental-network-imports --experimental-fetch dist/start.js --config=jitar.json"
    }
}
```

The start script will run the application starting point and pass the configuration file to Jitar. The ``--experimental-network-imports`` and ``--experimental-fetch`` flags are required for Jitar to work. More options can be found in the [server options section](03_runtime_services#server-options) of the runtime services.

Next we can fire up Jitar.

```bash
npm run start
```

Once Jitar has started we can run our procedure using the [RPC API](05_advanced_features#apis).

```http
GET http://localhost:3000/rpc/greetings/sayHello?name=John HTTP/1.1
```

---

{:.previous-chapter}
[Introduction](01_introduction)

{:.next-chapter}
[Runtime services](03_runtime_services)
