---
layout: doc

prev:
    text: Data consistency
    link: /develop/data-consistency

next:
    text: Middleware
    link: /develop/middleware

---

# Set up and tear down

Before an application starts or stops, you might want to do some additional things like connecting and disconnecting the database. For this, Jitar provides hooks for executing set up and tear down scripts.

The scripts can be configured per service in its configuration. Adding both scripts to a standalone configuration looks like this:

```json
{
    "url": "http://standalone.example.com:3000",
    "setUp": "./setUp",
    "tearDown": "./tearDown",
    "standalone": {}
}
```

Both script are optional, so you are free to use the one or the other, or none at all.

The scripts do not have any specific requirements, so there's nothing special about them. The following example shows a simple set up script.

```ts
// src/setUp.ts
import { Database } from './Database';

await Database.connect(/* ... */);
```

All this script does is importing dependencies and performing all actions required.

::: warning IMPORTANT
The set up script is executed before the service starts. If the script fails, Jitar will exit.
:::

The tear down script looks almost the same in this case.

```ts
// src/tearDown.ts
import { Database } from './Database';

await Database.disconnect();
```

::: warning IMPORTANT
The tear up script is executed after the service has stopped. If the script fails, Jitar will exit.
:::

It's common to create service specific scripts. If the scripts overlap or get to big, we recommend breaking them up into multiple smaller scripts.
