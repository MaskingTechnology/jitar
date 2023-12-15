# Migrate from 0.4.x to 0.5.0

The 0.5 version of Jitar introduces some breaking changes to the health checks and middleware. All changes are described here, with instructions how to adopt them.

## Health checks

The health check implementation came with a limitation: it couldn't access application resources.
To overcome this, we've made a breaking changes to the health check registration.

### Old situation

Let's look at the 'old way' first. Health checks are instantiated and registered at the server.

```ts
// src/jitar.ts
import { startServer, HealthCheck } from 'jitar';
import DatabaseHealthCheck from './DatabaseHealthCheck';

const moduleImporter = async (specifier: string) => import(specifier);
const server = await startServer(moduleImporter);

 // Registered by name here
server.addHealthCheck('database', new DatabaseHealthCheck(/* ... */));

server.start();
```

Next, they needed to be activated by name in the service configuration like this:

```json
{
    "url": "http://127.0.0.1:3000",
    "healthChecks": ["database"],
    "standalone": {}
}
```

This way, health checks could be registered once, and activated for multiple services.
We still love that idea, but registering the health checks in the bootstrap file (`jitar.ts`) wasn't pretty.

### New situation

We've simplified the setup to registering and activating health checks in a single step. Health checks now only need to be registered only once at the service configuration. The `addHealthCheck` function has been removed from the server. This keeps the bootstrap file nice and clean.

```ts
// src/jitar.ts
import { startServer } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);
const server = await startServer(moduleImporter);

server.start(); // Look ma, no health checks!
```

Instead of registering the health check by name, they are now registered (and activated) by module filename.

```json
{
    "url": "http://127.0.0.1:3000",
    "healthChecks": ["./defaultDatabaseHealthCheck"],
    "standalone": {}
}
```

The referred health module file must export an instance of the `HealthCheck` as default value like this.

```ts
// src/defaultDatabaseHealthCheck.ts
import DatabaseHealthCheck from './DatabaseHealthCheck';

const instance = new DatabaseHealthCheck(/* ... */);
export default instance;
```

Because the health check's isn't registered by name in the configuration, a name property has been added to the `HealthCheck` interface.

```ts
// src/DatabaseHealthCheck.ts
import { HealthCheck } from 'jitar';

export default class DatabaseHealthCheck implements HealthCheck
{
    constructor(/* ... */) { /* ... */ }

    get name() { return 'database'; } // New required property!

    get timeout() { return undefined; }
    
    async isHealthy(): Promise<boolean> { /* ... */ }
}
```

More information on health checks can be found in the [documentation](https://docs.jitar.dev/deploy/health-checks.html).

## Middleware

The middleware implementation had the same limitation as the health checks, and is fixed the same way. Additionally, we've updated our middleware interface to be more clean and extendable.

### Old situation

Let's again start by looking at the 'old way' of registering middleware first.

```ts
// src/jitar.ts
import { startServer } from 'jitar';
import RequestLoggerMiddleware from './RequestLoggerMiddleware';

const moduleImporter = async (specifier: string) => import(specifier);
const server = await startServer(moduleImporter);

// Registered here
server.addMiddleware(new RequestLoggerMiddleware(/* ... */));

server.start();
```

And the middleware definition looked like this.

```ts
import { Middleware, Version, NextHandler } from 'jitar';

// src/RequestLoggerMiddleware.ts
export default class RequestLoggerMiddleware implements Middleware
{
    constructor(/* ... */) { /* ... */ }

    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>
    {
        /* ... */
    }
}
```

### New situation

First, we've changed the way of registering in a way there's no need for registering middleware at the server anymore.

```ts
// src/jitar.ts
import { startServer } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);
const server = await startServer(moduleImporter);

server.start(); // Look ma, no middleware!
```

Instead, middleware gets registered in the service configuration by module filename, just like the same the health checks. The only difference is that middleware can only be added to the `standalone`, `node`, `gateway` and `proxy` services.

```json
{
    "url": "http://127.0.0.1:3000",
    "standalone":
    {
        "middlewares": ["./defaultRequestLogger"]
    }
}
```

The referred health module file must export an instance of the `HealthCheck` as default value like this.

```ts
// src/defaultRequestLogger.ts
import RequestLoggerMiddleware from './RequestLoggerMiddleware';

const instance = new RequestLoggerMiddleware(/* ... */);
export default instance;
```

The `Middleware` interface has also been simplified. The `handle` function in the old implementation takes a lot of arguments that we've combined in a `Request` object. This makes it simpler to create middleware, and the `handle` function looks a lot cleaner.

Also, manipulating the response headers wasn't very clear in this implementation because they were combined with the request headers. Therefore we've created a `Response` object that combines the response value and the response headers.

The new implementation looks as follows.

```ts
// src/RequestLoggerMiddleware.ts
import { Middleware, Request, Response, NextHandler } from 'jitar';

export default class RequestLoggerMiddleware implements Middleware
{
    constructor(/* ... */) { /* ... */ }

    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        // Modify the request (args and headers) here

        const response = await next();

        // Modify the response (result and headers) here

        return response;
    }
}
```

The `Request` has the following interface.

```ts
/* Properties */
const fqn = request.fqn; // readonly
const version = request.version; // readonly

/* Arguments */
request.setArgument('authenticator', authenticator);
const authenticator = request.getArgument('authenticator');
request.removeArgument('authenticator');

/* Headers */
request.setHeader('X-My-Header', 'value');
const myHeader = request.getHeader('X-My-Header');
request.removeHeader('X-My-Header');
```

The `Response` has the following interface.

```ts
/* Properties */
const result = response.result;
response.result = newResult;

/* Headers */
response.setHeader('X-My-Header', 'value');
const myHeader = response.getHeader('X-My-Header');
response.removeHeader('X-My-Header');
```

More information on Middleware can be found in the [documentation](https://docs.jitar.dev/develop/middleware.html).