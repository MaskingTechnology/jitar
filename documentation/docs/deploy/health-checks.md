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
import { pingDatabase } from '../common/utils;

export default class DatabaseHealthCheck implements HealthCheck
{
    async isHealthy(): Promise<boolean>
    {
        return pingDatabase();
    }
} 
```

To prevent the health checks from blocking the monitoring, each health check should be non-blocking, i.e. handle timeouts themselves.

## Adding health checks

A health check needs to be added to the service that has the connection to the database. For this we need to create a custom starter, just like we do for [adding middleware](../develop/middleware#adding-middleware).

```ts
// node.ts
import { startServer } from 'jitar';

import DatabaseHealthCheck from './health/DatabaseHealthCheck.js';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await startServer(moduleImporter);
server.addHealthCheck('database', new DatabaseHealthCheck());
```

Once added, the gateway will trigger the check automatically. You can also check yourself using the health API. More information on this can be found in the [MONITOR section](../monitor/health).
