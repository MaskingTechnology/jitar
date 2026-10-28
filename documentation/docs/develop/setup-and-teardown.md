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

The scripts can be configured per service in its configuration. Adding these scripts to a standalone configuration looks like this:

```json
{
    "url": "http://standalone.example.com:3000",
    "setUp": ["./setUpDatabase"],
    "tearDown": ["./tearDownDatabase"],
    "standalone": {}
}
```

Both script are optional, so you are free to use the one or the other, or none at all.

The scripts do not have any specific requirements, so there's nothing special about them. The following example shows a simple set up script.

```ts
// src/setUpDatabase.ts
import { Database } from './Database';

await Database.connect(/* ... */);
```

All this script does is importing dependencies and performing all actions required.

::: warning IMPORTANT
Set up scripts are executed before the service starts. If one of the scripts fails, Jitar will exit.
:::

The tear down script looks almost the same in this case.

```ts
// src/tearDownDatabase.ts
import { Database } from './Database';

await Database.disconnect();
```

::: warning IMPORTANT
Tear up scripts are executed after the service has stopped. If one of the scripts fails, Jitar will exit.
:::
