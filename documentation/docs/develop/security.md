---
layout: doc

prev:
    text: Validation
    link: /develop/validation

next:
    text: Assets
    link: /develop/assets

---

# Security

We probably do not have to tell you how important this section is. In this section you'll learn what security options Jitar provides and how to add authentication and authorization to a Jitar application.

## File access protection

The [repository service](../fundamentals/runtime-services.md#repository) has the role of protecting the access to the application files. It provides two endpoints for requesting files. Both have a different type of access protection.

The first endpoint is for requesting [assets](./assets). By default all files are protected. To make files accessible they must be whitelisted in the [repository configuration](../fundamentals/runtime-services.md#configuration-properties).

```json
{
    "url": "http://repository.example.com:3000",
    "repository":
    {
        "assets": ["*.html", "*.js", "*.css", "assets/**/*"]
    }
}
```

Assets can be whitelisted per file, or by using glob patterns. For example the pattern `assets/**/*` whitelists all files and subfolder files in the assets folder.

The second endpoint is for requesting module files internally used by nodes to load their functions. Requesting a module file requires a valid client id provided by the repository at the registration of a node. The repository only allows requesting files with the .js extension that are placed in the application folder. To prevent any form of information leakage make sure the code does not contain sensitive information (like access keys).

::: tip PRO TIP
To prevent the access of server modules from any client, make sure that all modules are registered in a server [segment](../fundamentals/building-blocks#segments). The repository will provide a remote implementation if a client tries to load the module. Remote implementations do not contain any information other than function and parameter names.
:::

## Authentication and authorization

The easiest way to add auth to your application is [using middleware](./middleware). We recommend separating the implementation of the authentication and authorization process. This enables allocating these tasks to different services in a distributed setup. Our typical setup looks like this.

```ts
import { Middleware, Version, NextHandler } from 'jitar';

export default class Authentication implements Middleware
{
    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>
    {
        // Get Authorization header
        // Authenticate the user
        // Add user info to the args
    }
}
```

In a distributed setup we register this middleware at the [gateway service](../fundamentals/runtime-services.md#gateway) to make sure a node only gets called when the user is authenticated. The authorization may depend on attributes gathered during the execution of the function. Therefore we add the authorization middleware to the [node service](../fundamentals/runtime-services#node).

```ts
import { Middleware, Version, NextHandler } from 'jitar';

export default class Authorization implements Middleware
{
    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>
    {
        // Get user info from the args (remove if needed)
        // Authorize the user (RBAC, ABAC, …)
    }
}
```

When using the [standalone service](../fundamentals/runtime-services#standalone) you can add both middleware to the same server. Make sure to register them in the correct order.
