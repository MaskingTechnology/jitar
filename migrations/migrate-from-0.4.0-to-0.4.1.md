# Migrate from 0.4.0 to 0.4.1

We've added more configurability to the Jitar server that introduced a few breaking changes.
All changes are described in detail below.

## startServer() is replaced with buildServer()

In prior versions we've use a `startServer` function that created and started the Jitar server in a single step.

**before**
```ts
// jitar.ts
import { startServer } from 'jitar'; // old way

const moduleImporter = async (specifier: string) => import(specifier);

startServer(moduleImporter);
```

In this release we've separated both steps to get more control over building the Jitar server.
We've replaced the `startServer` function with the `buildServer` function and added a `start()` function to the server.

**after**
```ts
// jitar.ts
import { buildServer } from 'jitar'; // new way

const moduleImporter = async (specifier: string) => import(specifier);

const server = await buildServer(moduleImporter);
server.start(); // This step has been added
```

## Health checks are more configurable

### Configurable selection

Before, a separate starter file was required for each instance that required its own set of health checks.

**before**
```ts
// jitar-gateway.ts
import { buildServer } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await buildServer(moduleImporter);
server.addHealthCheck('idp', new IDPHealthCheck());
server.start();

// --------------------------------------------------------

// jitar-node.ts
import { buildServer } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await buildServer(moduleImporter);
server.addHealthCheck('database', new DatabaseHealthCheck());
server.start();
```

With this update all health checks can be registered into a single starter file.

**after**
```ts
// jitar.ts
import { buildServer } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await startServer(moduleImporter);

// All health checks can be added in the same script
server.addHealthCheck('idp', new IDPHealthCheck());
server.addHealthCheck('database', new DatabaseHealthCheck());

server.start();
```

In the configuration file the health checks need to be selected that belong to that service.

**after**
```json
// services/gateway.json
{
    "url": "http://localhost:3000",
    "healthChecks": ["idp"],
    "gateway":
    {
        // ...
    }
}

// services/node.json
{
    "url": "http://localhost:3000",
    "healthChecks": ["database"],
    "node":
    {
        // ...
    }
}
```


More information can be found in the [health check](https://docs.jitar.dev/deploy/health-checks.html) documentation.

### Configurable timeout

Before, each health check was executed using the same timeout scheme.
With this update each health check can define its own timeout.
For this the health check interface is updated and now has a getter for a `timeout` value.
Each health check **must** implement the timeout getter, even if the health check doesn't need a timeout.
We want the absence of a timeout value to be a well considered choice.

```ts
// src/health/DatabaseHealthCheck.ts
import { HealthCheck } from 'jitar';
import { pingDatabase } from '../common/utils';

export default class DatabaseHealthCheck implements HealthCheck
{
    get timeout() { return undefined; } // Add this getter

    async isHealthy(): Promise<boolean>
    {
        return pingDatabase();
    }
}
```

To define a health check without a timeout value, make the getter return `undefined`. Otherwise set a value in milliseconds to consider the health check timed out and unhealthy. You can find an example in the [health check interface](https://docs.jitar.dev/deploy/health-checks.html) documentation.