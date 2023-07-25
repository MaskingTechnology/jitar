---
layout: doc

prev:
    text: Load balancing
    link: /deploy/load-balancing

next:
    text: RPC API
    link: /integrate/rpc-api

---

# Health checks

The [gateway service](../fundamentals/runtime-services#gateway) determines if a node still can be used safely by frequently checking its health. Health checks are used for health determination. Jitar has no out-of-the-box health checks, but you can create and add your own. A common use case is for checking database availability. In case a node can't access its database, we want the gateway to stop using it. Health checks can be added to any of the services.

## Creating health checks

Jitar provides an interface you have to implement in order to add a custom check to a service. Let's look at a simple database check example:

```ts
// src/health/DatabaseHealthCheck.ts
import { HealthCheck } from 'jitar';
import { pingDatabase } from '../common/utils';

export default class DatabaseHealthCheck implements HealthCheck
{
    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean>
    {
        return pingDatabase();
    }
} 
```

The health check interface requires you to implement the `timeout` getter. If a timeout is not required, return `undefined`. Otherwise set the time in milliseconds for the health check to be considered unhealthy.

## Adding health checks

A health check needs to be added to the service that has the connection to the database. We need to update the starter script to register the health check at the server level, and use configuration to determine the actual instance that will get the health check.

```ts
// jitar.ts
import { buildServer } from 'jitar';

import DatabaseHealthCheck from './health/DatabaseHealthCheck.js';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await buildServer(moduleImporter);
server.registerHealthCheck('database', new DatabaseHealthCheck());
server.start();
```

The configuration of the gateway needs to be updated to include the health check.

```json
// services/gateway.json
{
    "url": "http://localhost:3000",
    "healthChecks": ["database"],
    "gateway":
    {
        // ...
    }
}
```

Once added, the gateway will trigger the check automatically. You can also check yourself using the health API. More information on this can be found in the [MONITOR section](../monitor/health).
