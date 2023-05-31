---
layout: doc

prev:
    text: Data consistency
    link: /develop/data-consistency

next:
    text: Validation
    link: /develop/validation

---

# Middleware

Middleware provides a way to hook into Jitars automated communication system. It allows you to add additional logic to incoming and outgoing requests. Common use cases are adding authentication and logging to applications.

In this section you'll learn how to create and add your own middleware.


## Creating middleware

Any middleware required to implement Jitars Middleware interface. This interface has a single function to handle the request.

```ts
// src/MyMiddleware.ts
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

The `fqn`, `version` and `next` parameters are immutable, so only the args and headers can be modified. The args provide the procedure arguments. The headers contain the HTTP-headers that provide meta-information like authentication.

Because all middleware is chained, the next parameter must always be called. This function does not take any arguments, all the arguments will be provided automatically. Note that the handle function is async so it can return a promise.

## Adding middleware

Middleware needs to be registered at the start of a Jitar server.

```ts
// src/standalone.ts
import { startServer } from 'jitar';
import MyMiddleware from './MyMiddleware';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await startServer(moduleImporter);
server.addMiddleware(new LoggingMiddleware());
```

It's only useful to add middleware to a node, gateway, proxy and standalone service because they are actively involved with the communication system. Adding middleware to a repository service won't result in an error, but doesn't have any effect either.

It's likely that the different services require different middleware. For example, you might want to add authentication middleware to the gateway and authorization middleware to the node. In this case each service needs its own starter script containing their specific middleware.

::: warning KEEP IN MIND 
Middleware is executed in the order of registration. This means that the middleware that is added first is called first.
:::
