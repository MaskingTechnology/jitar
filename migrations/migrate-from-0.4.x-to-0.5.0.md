# Migrate from 0.4.x to 0.5.0

The 0.5 version of Jitar introduces some breaking changes. All changes are described here, with instructions how to adopt them.

## Health checks

Working with health checks that need to access application resources had a few limitations.
To overcome these, we've made breaking changes to the health check implementation.

Let's look at the current implementation first. Health checks are instantiated and registered at the server.

```ts
// src/jitar.ts
import { startServer, HealthCheck } from 'jitar';

class DatabaseHealthCheck implements HealthCheck
{
    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean> { /* ... */ }
}

const server = await startServer(moduleImporter);
server.addHealthCheck('database', new DatabaseHealthCheck()); // Registered here
server.start();
```

Next, they are activated by name in the service configuration like this:

```json
{
    "url": "http://127.0.0.1:3000",
    "healthChecks": ["database"],
    "standalone": {}
}
```

This way, health checks can be registered once, en activated for multiple services.
We still love that idea, but registering all health checks in a single bootstrap file wasn't pretty.

So, we've changed the way of registering. There's no need for registering health checks at the server anymore.

```ts
// src/jitar.ts
import { startServer, HealthCheck } from 'jitar';

const server = await startServer(moduleImporter);
server.start(); // Look ma, no health checks!
```

Instead, health checks are registered (and activated) in the service configuration.
This is done by importing modules containing a health check instance.

```json
{
    "url": "http://127.0.0.1:3000",
    "healthChecks": ["./databaseHealthCheck"],
    "standalone": {}
}
```

The health check module must export an instance of the `HealthCheck` interface as default value.
Because the health check's isn't registered by name in the configuration, a name property has been added to the `HealthCheck` interface. An example health check instance module looks like this.

```ts
// src/databaseHealthCheck.ts
class DatabaseHealthCheck implements HealthCheck
{
    get name() { return 'database'; } // New required property!

    get timeout() { return undefined; }
    
    async isHealthy(): Promise<boolean> { /* ... */ }
}

const instance = new DatabaseHealthCheck();
export default instance;
```

In this example the health check class and instance are separated. This is good practice to enable reusability of the health checks. For simple cases, the class and instance can be defined in the same module file.

More information on health checks can be found in the [documentation](https://docs.jitar.dev/deploy/health-checks.html).

## Middleware

We've updated our middleware model to be more clean and extendable.

Let's look at the 'old' implementation first.

```ts
import { Middleware, Version, NextHandler } from 'jitar';

export default class MyMiddleware implements Middleware
{
    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>
    {
        // Modify the request (args and headers) here

        const result = await next();

        // Modify the response (result) here

        return result;
    }
}
```

The `handle` function in this implementation takes a lot of arguments that we've combined in a `Request` object.
This makes it simpler to create middleware, and the `handle` function looks a lot cleaner.

Also, manipulating the response headers wasn't very clear in this implementation because they were combined with the request headers.
Therefore we've created a `Response` object that combines the response value and the response headers.

The new implementation looks as follows.

```ts
import { Middleware, Request, Response, NextHandler } from 'jitar';

export default class MyMiddleware implements Middleware
{
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