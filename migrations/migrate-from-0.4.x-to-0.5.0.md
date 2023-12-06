# Migrate from 0.4.x to 0.5.0

The 0.5 version of Jitar introduces some breaking changes. All changes are described here, with instructions how to adopt them.

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