---
layout: doc

prev:
    text: Creating a cluster
    link: /guides/creating-a-cluster

next:
    text: Migrate away from Jitar
    link: /guides/migrate-away-from-jitar

---

# Add Jitar to an existing project

In this guide we will explain what needs to be done to add Jitar to your project. Projects that already have a nodejs backend, and optionally have a frontend are covered.

## Prerequisites

A Jitar project has a few requirements to function properly. Before adding Jitar make sure the the following conditions are (or can be) met:

* Node version 20.0 or higher
* TypeScript 4.7 or higher
* Use of ESM (CommonJS is not supported)
* Vite, if a frontend needs to be hooked in

## Roadmap

Adding Jitar to your project takes a few steps. In these steps we use the application structure we use ourselves. This is not mandatory, so feel free to use a setup that matches your application best.

### Step 1: Add Jitar to your project

The first thing we need to do is to add Jitar as a dependency in the current project.

```bash
npm install jitar
```

There are also a few requirements for the `tsconfig.json` file. Make sure to use ESNext as target and module, and to output all transpiled code in a separate folder (we use `dist` by default).

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

In the [environments section](../deploy/environments), the setup of the development environment is documented. Follow those steps to create a service configuration and add a start script.

### Step 2: Choose a segmentation strategy

Based on the current architecture you’ll need to choose a segmentation strategy. If the current architecture uses microservices, each service will end up as a separate segment in Jitar. For a monolithic application, a single segment will suffice.

In the [segmentation section](../deploy/segmentation) more detailed information can be found on how to create them. We always put the segment files in a `segments`  folder for easy identification.

### Step 3: Add functions to the segment files

Identify the functions behind the API endpoints and add them to the segment file(s). There are some prerequisites for the functions. You can find them in the [FUNDAMENTALS section](../fundamentals/building-blocks#functions).

If an endpoint contains application logic you need to create a new function and place the logic into it. This function should also be added to a segment file.

### Step 4: Replace the api calls

Remove the api logic and handling. Optionally, replace the api calls with direct function imports in the client(s).

### Step 5: Choose the runtime services

The required runtime services depend on the operational requirements. In the guide [Creating a cluster](./creating-a-cluster) the different clusters are described, including the operational requirements they cover.

### Step 6: Configure the frontend (optional)

If the application also has a frontend then a few additional configurations are important to add. You’ll need to use Vite. This is currently the only supported build tool. See the [Vite plugin section](../integrate/vite-plugin) on how to configure the plugin.
