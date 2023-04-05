---
layout: default
title: Advanced features
---

# Advanced features

In this section we will look at the advanced features of Jitar. Each feature will be explained with an example based on the ``Hello World`` example from the [getting started](quickstart.html) page. All examples are available on [GitHub](https://github.com/MaskingTechnology/jitar/tree/main/examples){:target="_blank"} as separate projects.

---

## API's

Jitar has some useful API's that can be used to interact with a service or services in a cluster. They will be described below.

{:.alert-info}
The internally used API's are not described here.

### RPC

The RPC API is used to call procedures (functions) on a node.

```http
GET http://node.example.com:3000/rpc/greetings/sayHello?firstName=John HTTP/1.1
```

The RPC API also supports the POST method. This is useful when passing complex or large amounts of data.

```http
GET http://node.example.com:3000/rpc/greetings/sayHello HTTP/1.1
content-type: application/json

{
    "firstName": "Jane"
}
```

{:.alert-info}
When required parameters are missing the RPC call will fail with a MissingParameterValue error. When additional parameters are send, the RPC call will also fail with an UnknownParameter error.

### Assets

For building full-stack applications it is important to be able to retrieve any type of application file. The assets API allows you to do this. Asset requests are handled by the repository. The repository acts like a web server by serving all files from the application directory.

```http
GET http://repository.example.com:3000/images/logo.png HTTP/1.1
```

This request will return the logo.png file from the application images directory. Files can also be requested from the root directory. If no filename is provided the index file will be returned that is configured for the repository.

{:.alert-info}
All assets are private by default. They can be made public using [glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)), i.e. ``assets/**/*`` to make all files public in the *assets* folder and it child folders. See the [repository](runtime-services.html#repository) description for the configuration.

### Jitar

The repository provides another important API for building full-stack applications: the Jitar API. This API allows clients (mainly the web browser) to load Jitar components.

```http
GET http://repository.example.com:3000/jitar/hooks.js HTTP/1.1
```

This request will return the content of the ``hooks.js`` file. Other Jitar files can be requested in the same way. The Jitar API is used by the [startClient](#startclient) hook.

### Health

To check the health of a node the health API can be used. This API is internally used by the gateway to check the health of its nodes, but can also be used for external monitoring.

There are two types of health checks available. The first is a simple status check that returns a boolean value indicating if the node is OK.

```http
GET http://node.example.com:3000/health/status HTTP/1.1
```

The second is a detailed check that returns a JSON object with the health details of each health check.

```http
GET http://node.example.com:3000/health HTTP/1.1
```

By default there are no health checks registered, so an empty JSON object will be returned. A health check can specify its own fields, so there is no specific format. More information about health checks can be found in the [Health checks](#health-checks) section.

---

## Hooks

Jitar provides configuration and runtime hooks that can be used by applications. They will be described below.

{:.alert-info}
The internally used hooks are not described here.

### startServer

To bootstrap any Jitar service in Node.js we need to start the server using the ``startServer`` hook. The server will read the configuration and use the configured service as runtime.

{:.filename}
src/server.ts

```ts
import { startServer } from 'jitar-nodejs-server';

const moduleImporter = async(specifier: string) => import(specifier);

startServer(moduleImporter);
```

We need to pass a module loader to this function to make sure that Node.js modules are loaded from the application context. This is needed because the application runs in the Jitar context, and doesn't have access to the application dependencies.

The module loader is a simple async function that takes a module specifier and returns a module and is called by Jitar when a module is imported by one of the application modules.

### startClient

When building full-stack applications, Jitar needs to start on the client side as well. This is done using the ``startClient`` hook. The client will create a local node as runtime that uses its origin as a repository.

{:.filename}
src/client.ts

```ts
// @ts-ignore (the import will be valid at runtime)
import { startClient } from '/jitar/client.js';

const client = await startClient('client');
const { default: sayBoth } = await client.import('./greetings/sayBoth.js');
const message = await sayBoth('John', 'Doe');

alert(message);
```

We need to pass the segment file(s) containing the components we want to load and run on the client. Adding more segment files can simply be done by adding them as arguments.

To enable the segmentation of the application, we need to import the components using the Jitar client. This is done by using its ``import`` function that resolves to the imported module.

### runProcedure

For importing and running procedures Jitar fully supports the ES module system. But it also provides a hook to do this dynamically. This hook is mainly internally used for running procedures on another node, but can also be used in applications.

{:.filename}
src/greetings/sayBoth.ts

```ts
import { runProcedure } from 'jitar';

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    const hiMessage = await runProcedure('greetings/sayHi', '0.0.0', { 'firstName': firstName }, this);
    const helloMessage = await runProcedure('greetings/sayHello', '0.0.0', { 'firstName': firstName, 'lastName': lastName }, this);

    return `${hiMessage}\n${helloMessage}`;
}
```

We need to pass the ``module/name`` of the procedure, the version and the arguments. The arguments must be a JavaScript object containing the argument values by name. The value can be any [transferable type](basic-features.html#data-transportation).

Optionally you can pass the ``this`` value containing the runtime context of the procedure. This context contains the headers - like the authorization header - that need to be used in a remote call in case the procedure is not locally available.
Therefore it is highly recommended to pass this value.

{:.alert-info}
Only procedures that are added to a segment file can be called.

The ``runProcedure`` function will run the procedure locally if it is available. If not, it will try to run the procedure (version) on another node using the [RPC API](#rpc). If the procedure is not available on any node, an ``ProcedureNotFound`` error will be thrown.

{:.alert-warning}
Using this hook breaks the IntelliSense support and will make your application dependent on Jitar. Therefore use this hook wisely and with care.

---

## Health checks

Health checks are used to determine if a [node](runtime-services.html#node) is healthy or not. They are used by the [gateway](runtime-services.html#gateway) to determine if a node still can be used. If for example a node can not reach the database anymore, it will be removed from the gateway. For checking the database connection a health check has to be created.

A health check is a class that implements the HealthCheck interface. The interface has a single function called isHealthy() that returns a boolean.

{:.filename}
src/DatabaseHealthCheck.ts

```ts
import { HealthCheck } from 'jitar';

export default class DatabaseHealthCheck implements HealthCheck
{
    async isHealthy(): Promise<boolean>
    {
        // Check database connection
        return true;
    }
}
```

Because the function is async it can return a promise. This is useful when the health check needs to do some async work, like checking the database connection.

When the Jitar server has started using the [startServer](#startserver) hook we can register one or more health checks.

{:.filename}
src/start.ts

```ts
import { startServer } from 'jitar-nodejs-server';

import DatabaseHealthCheck from './DatabaseHealthCheck.js';

const moduleImporter = async(specifier: string) => import(specifier);

startServer(moduleImporter).then(server =>
{
    server.addHealthCheck('database', new DatabaseHealthCheck());
});
```

The name is used to identify its status in the health check API.

{:.alert-warning}
The name must be unique, so if you add a health check with the same name as an existing one, the existing one will be overwritten.

{:.alert-info}
Top level await is not supported in Node.js yet, so we use the classic promise syntax for this case.

---

## Middleware

Middleware provides a way to intercept and modify the request and response of a RPC call. It can be used to implement logging, authentication, and other cross-cutting concerns.

A middleware is a class that implements the Middleware interface that has a single function to handle the request.

{:.filename}
src/ExampleMiddleware.ts

```ts
import { Middleware, Version, NextHandler } from 'jitar';

export default class ExampleMiddleware implements Middleware
{
    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>
    {
        // Modify the request (arg and headers) here

        const result = await next();

        // Modify the response (result) here

        return result;
    }
}
```

The ``fqn``, ``version`` and ``next`` parameters are immutable, so only the ``args`` and ``headers`` can be modified. The ``args`` provide the procedure arguments.
The ``headers`` contain the HTTP-headers that provide meta-information like authentication.

Because all middleware is chained, the ``next`` parameter must always be called. This function does not take any arguments, all the arguments will be provided automatically.
Note that the handle function is async so it can return a promise.

When the Jitar server is started using the startServer hook we can register one or more middleware.

{:.filename}
src/start.ts

```ts
import { startServer } from 'jitar-nodejs-server';

import ExampleMiddleware from './ExampleMiddleware.js';

const moduleImporter = async (specifier: string) => import(specifier);

startServer(moduleImporter).then(server =>
{
    server.addMiddleware(new ExampleMiddleware());
});
```

Middleware can be added to the [node](runtime-services.html#node), [gateway](runtime-services.html#gateway),
[proxy](runtime-services.html#proxy) and [standalone](runtime-services.html#standalone) services support middleware.

{:.alert-warning}
The execution order of the middleware is reversed. This means that the middleware that is added last is called first.

---

## CORS

CORS headers can be added to the response of a RPC call. This is useful when you want to allow cross-origin requests.

When the Jitar server is started using the startServer hook we can add CORS headers.

{:.filename}
src/start.ts

```ts
import { CorsMiddleware } from 'jitar';
import { startServer } from 'jitar-nodejs-server';

const moduleImporter = async (specifier: string) => import(specifier);

startServer(moduleImporter).then(server =>
{
    //server.addMiddleware(new CorsMiddleware()); // allow all origins and headers
    //server.addMiddleware(new CorsMiddleware('https://jitar.dev')); // allow specific origin and all headers
    server.addMiddleware(new CorsMiddleware('https://jitar.dev', 'Content-Type, Authorization')); // allow specific origin and headers
});
```

The first argument sets the [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) header. This header only supports a single origin or a wildcard. The latter is the default when no origin is provided.

The second argument sets the [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) header. This header supports a comma separated list of headers or a wildcard. The latter is the default when no headers are provided.

{:.alert-info}
The [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) header is always set to GET and POST because these are by default supported by the [RPC API](#rpc).

---

{:.previous-chapter}
[Basic features](basic-features.html)

{:.next-chapter}
[Building applications](building-applications.html)
