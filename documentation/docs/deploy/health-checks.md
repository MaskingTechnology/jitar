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

Jitar provides an interface you have to implement in order to add a custom check to a service. Only health check instances can be registered. Each instance needs to be exported as default in a separate module file. Let's look at a simple database check example:

```ts
// src/databaseHealthCheck.ts
import { HealthCheck } from 'jitar';

export default class DatabaseHealthCheck implements HealthCheck
{
    get name() { return 'database'; }

    get timeout() { return undefined; }

    async isHealthy(): Promise<boolean>
    {
        /* check status here */
    }
}

const instance = new DatabaseHealthCheck();

export default instance;
```

The health check interface requires you to implement the `name` and  `timeout` getter. The name is used for its registration, and needs to be unique. The timeout specifies the time in milliseconds that the service waits before checking for the health again. If a timeout is not required, return `undefined`. Otherwise set the time in milliseconds.

## Adding health checks

A health check needs to be added to the service that has the connection to the database. This is done by registering the health check module file in the service configuration.

```json
// services/node.json
{
    "url": "http://localhost:3000",
    "healthChecks": ["./databaseHealthCheck"],
    "node":
    {
        // ...
    }
}
```

Once added, the node will trigger the check automatically. You can also check yourself using the health API. More information on this can be found in the [MONITOR section](../monitor/health).
