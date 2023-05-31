# Migrate from 0.3.x to 0.4.0

We’ve changed the package structure from version 0.3.x to 0.4.0. This is a breaking change and you’ll need to perform some actions to migrate to version 0.4 of Jitar.

The `jitar` package is now the main package and contains all the functionality for your application to be executed. Previously, we had different packages for different functionalities, but we’ve decided that we wanted to provide a single npm package that can just be installed. The other packages are also marked as deprecated.

## Jitar dependency

Replace the `jitar-nodejs-server` dependency with `jitar` version 0.4.0. There are also older versions of `jitar` available, but those are still linked to the previous package structure. 

So, the new package.json should look like

```json
  "dependencies": {
	"jitar": "^0.4.0"
  }
```

The existing starter files need to be updated. They now import `startServer` from `jitar-nodejs-server`, but that needs to be `jitar` now.

```ts
import { startServer } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);

startServer(moduleImporter);
```

## Middleware

An important change for the middleware is that the order of execution has been reversed. In version 0.3 the last one added was executed first. In version 0.4 the first middleware added is also the first one to get executed.

Other code changes are not required, whether you use the `CorsMiddleware` or custom middleware. Both are already imported from the current `jitar` package and keep being available in version 0.4.

Optionally, the middleware can be added to the server when the `startServer` has been awaited. Previously a promise was required to add middleware to the server.

```ts
const server = await startServer(moduleImporter);
server.addMiddleware(CorsMiddleware());
```

## Vite plugin

The plugin for Vite has been updated too. The old package has been deprecated and the new package is called `@jitar/plugin-vite`. This devDependency needs to be changed as well. We haven’t restarted with the numbering, so the first version of @jitar/plugin-vite is 0.4.0.

```json
"devDependencies": {
	"@jitar/plugin-vite": "^0.4.0"
}
```

The vite config needs to be updated to use the new package for the plugin.

```ts
// vite.config.ts

import jitar from '@jitar/plugin-vite'
```

## Naming conventions

* The naming conventions we advise are slightly different in this version. These changes are optional, but in case you need to consult the docs it could be helpful.
* The configuration of the services is no longer in the `conf` folder, but has moved to `services`.
* The segment configuration is placed in the `segments` folder, whereas before the root folder of the project was fine.
* The name of the starter files are now named after the service it starts, i.e. `standalone.ts` for the standalone service. It used to be `jitar.ts`.
* The starter scripts are also named after the service they start, i.e. `npm run gateway` to start the gateway service.

## Miscellaneous

The version of node has been set to 18.7 or higher. This removes the need for the `--experimental-fetch` flag. The starter script can have it removed.
