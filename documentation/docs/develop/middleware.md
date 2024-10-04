---
layout: doc

prev:
    text: Set up and tear down
    link: /develop/setup-and-teardown

next:
    text: Validation
    link: /develop/validation

---

# Middleware

Middleware provides a way to hook into Jitars automated communication system. It allows you to add additional logic to incoming and outgoing requests. Common use cases are adding authentication and logging to applications.

In this section you'll learn how to create and add your own middleware.

## Creating middleware

Jitar provides an interface you have to implement in order to add a middleware to a service. Let's look at a simple example:

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

The `request` parameter contains all request information including the arguments and headers. It has the following interface.

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

::: warning ARGUMENTS
When setting an argument it is important to remember that it is added to each and every request. Any function that is called after the middleware must have the argument as a parameter available. 
:::

::: tip OPTIONAL ARGUMENTS
The middleware can set optional arguments. These are arguments that are prefixed with a *, i.e. `*name`. This means that jitar will automatically pass the argument to a function if it has a parameter with the same name.
:::

The `response` contains besides the actual value the response headers. It has the following interface.

```ts
/* Properties */
const result = response.result;
response.result = newResult;

/* Headers */
response.setHeader('X-My-Header', 'value');
const myHeader = response.getHeader('X-My-Header');
response.removeHeader('X-My-Header');
```

Because all middleware is chained, the `next` parameter must always be called. This function does not take any arguments, all the arguments will be provided automatically. Note that the handle function is async so it can return a promise.

## Adding middleware

Middleware needs to be registered at the service configuration. Only middleware instances can be registered. Each instance needs to be exported as default in a separate module file like this:

```ts
// src/defaultRequestLogger.ts
import RequestLoggerMiddleware from './RequestLoggerMiddleware';

const instance = new RequestLoggerMiddleware(/* ... */);
export default instance;
```

We can use this module file for the registration at the service:

```json
// services/worker.json
{
    "url": "http://localhost:3000",
    "middlewares": ["./defaultRequestLogger"],
    "worker":
    {
        ...
    }
}
```

It's likely that different services require different middleware. For example, you might want to add authentication middleware to the gateway and authorization middleware to the worker.

::: warning KEEP IN MIND 
Middleware is executed in the order of registration. This means that the middleware that is added first is called first.
:::
