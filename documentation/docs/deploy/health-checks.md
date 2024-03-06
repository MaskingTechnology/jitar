---
layout: doc

prev:
    text: Load balancing
    link: /deploy/load-balancing

next:
    text: Runtime settings
    link: /deploy/runtime-settings

---

# Health checks

The [gateway service](../fundamentals/runtime-services#gateway) determines if a worker still can be used safely by frequently checking its health. Health checks are used for health determination. Jitar has no out-of-the-box health checks, but you can create and add your own. A common use case is for checking database availability. In case a worker can't access its database, we want the gateway to stop using it. Health checks can be added to any of the services.

::: warning BREAKING CHANGES
Version 0.5 introduced breaking changes. Please check our [migration guide](https://github.com/MaskingTechnology/jitar/blob/main/migrations/migrate-from-0.4.x-to-0.5.0.md) for more information.
:::

In this section you'll learn how to create and add your own health checks.

## Creating health checks

Jitar provides an interface you have to implement in order to add a custom check to a service. Let's look at a simple example:

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

The health check interface requires you to implement the `name` and  `timeout` getter. The name is used for its registration, and needs to be unique. The timeout specifies the time in milliseconds that the service waits before checking for the health again. If a timeout is not required, return `undefined`. Otherwise set the time in milliseconds.

## Adding health checks

Health check needs to be registered at the service configuration. Only health check instances can be registered. Each instance needs to be exported as default in a separate module file like this:

```ts
// src/defaultDatabaseHealthCheck.ts
import DatabaseHealthCheck from './DatabaseHealthCheck';

const instance = new DatabaseHealthCheck(/* ... */);
export default instance;
```

We can use this module file for the registration at the service:

```json
// services/worker.json
{
    "url": "http://localhost:3000",
    "healthChecks": ["./databaseHealthCheck"],
    "worker":
    {
        // ...
    }
}
```

Once added, the worker will trigger the check automatically. You can also check yourself using the health API. More information on this can be found in the [MONITOR section](../monitor/health).

**Note** that health checks are defined at the root level of the configuration. This means you can add health checks for all service types. When using external monitoring tools that monitor a cluster, this could be useful.
