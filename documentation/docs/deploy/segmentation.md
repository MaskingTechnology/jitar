---
layout: doc

prev:
    text: Debugging
    link: /develop/debugging

next:
    text: Resources
    link: /deploy/resources

---

# Segmentation

Segments are used to break applications down into distributable pieces. A segment groups module files that need to be deployed together. Its definition is placed into a JSON segment file. Let's look at a simple example file named `default.segment.json`.

```json
{
    "./domain/sayHello":
    {
        "sayHello": {  "access": "public" }
    }
}
```

This example includes the `sayHello` function from the `domain/sayHello.ts` module file. Now let's decompose the configuration file and dive into the details.

### Naming and placement

Jitar uses the configuration filename for identifying segments. There is no mandatory location for placing segment configuration files, so Jitar uses the `.segment.json` extension for scanning them in the project.

Segments are named, and their names are derived from the filename. Everything that is in front of the `.segment.json` extension is used as the name. So for the filename `default.segment.json` the segment is named 'default'.

::: info NOTE
Although there is no mandatory location for these files, we always place them in a segment folder in the root directory of the project. We've done this for all our projects and examples and made finding them very easy.
:::

### Configuration structure

A segment file works like the JavaScript module system. It defines what to import from from what module file. Its basic structure looks like this.

```json
{
    MODULE_FILE_1:
    {
        IMPORT_1: { … },
        IMPORT_2: { … },
        …
    },
    MODULE_FILE_2:
    {
        …
    },
    …
}
```

A segment can contain zero to an unlimited number of modules. For each module needs to be configured what to import.

::: warning IMPORTANT
All imported functions must be async. Jitar will throw a `FunctionNotAsync` error if you try to import a non-async function.
:::

The module file specifier does not require an extension. It will automatically look for the (compiled) .js file when loading the module. The source folder is used as the root location, so you can use relative paths.

The import names must correspond with the export names in the module. You can also import the default.

```json
{
    "./domain/sayHello":
    {
        "default": { "access": "public" },
        "another": { "access": "public" },
       …
    }
}

```

Imports have multiple properties that can be configured. These properties will be explained next.

### Trusted clients

When building a distributed application, you don't want all functions to be available by the outside world. Some functions are only used internally by other segments. To protect the access to these functions, Jitar provides a `trustKey` property in the [runtime services](../fundamentals/runtime-services#worker). This key is used to create trusted clients. Trusted clients can access functions with the `protected` access level.

Any client that wants to access a protected function must provide a valid key. It needs to be added to the http header `X-Jitar-Trust-Key`. Any worker that has a valid key is automatically considered a trusted client, and adds the access key to the http header of outgoing requests. Any worker that doesn't have a valid access key is considered an untrusted client and can only access `public` functions.

::: info Note
To enable trusted clients, the gateway must always have a trusted key configured. Any worker that wants to register itself as a trusted client, must have the same value for the `trustKey` in its configuration.
:::

### Access protection

Segments enable deploying application pieces on different servers. This requires functions to be remotely accessible to make sure the application keeps working. But it also introduces a security risk that needs to be addressed. The access property sets the basic access level of a function. For example.

```json
{
    "./domain/secret":
    {
        "getSecret": { "access": "private" },
        "checkSecret": { "access": "protected" },
        "guessSecret": { "access": "public" }
    }
}
```

By default a function has private access. This means that the function can only be called within its own segment, and cannot be called from outside.

Protected functions can be called from outside, but only if the client is trusted. This is useful for functions that need to be called by other segments, but not by external applications.

Functions that need to be accessible from outside need to have the public access level.

::: tip PRO TIP
To protect the access to public functions [authentication and authorization](../develop/security.md#authentication-and-authorization) needs be applied.
:::

::: warning NOTE
Any function is considered `public` if one of the implementations is public. This means that a function with multiple versions can be public, even if one of the versions is private or protected.
:::

::: warning NOTE
Any function is considered `protected` if one of the implementations is protected. This means that a function with multiple versions can be protected, even if one of the versions is private.
:::

### Versioning

Jitar generates an endpoint for each public function. These endpoints are used for automating the internal communication, but can also be used by external applications with [our RPC API](../integrate/rpc-api). To control the implementation of breaking changes in external applications, Jitar supports providing multiple versions of functions.

For example, if we need to update our sayHello function to split the name parameter into a separate first and last parameter, we can implement it like this.

```ts
// src/domain/sayHelloV2.ts
export async function sayHello(first: string, last: string): Promise<string>
{
    return `Hello, ${first} ${last}!`;
}
```

Now we have a separate module file per version that can be registered in the segment configuration with their own version.

```json
{
    "./domain/sayHello":
    {
        "sayHello": { "access": "public", "version": "1.0.0" }
    },
     "./domain/sayHelloV2":
    {
        "sayHello": { "access": "public", "version": "2.0.0" }
    }
}
```

Jitar groups functions by name and registers them by version. In this case both functions are available for use and are called with a specific version.

::: warning IMPORTANT
When registering the same version multiple times, Jitar will execute the first registered function.
:::

### Aliases

By default the import names are used for registering functions. In some cases you might want to expose a function under an alias name. A common use case is to create unique names in case multiple modules have equal exports or when combining multiple versions in a single module file. For example combining the sayHello functions.

```ts
// src/domain/sayHello.ts
export async function sayHello(name: string): Promise<string>
{
    return `Hello, ${name}!`;
}

export async function sayHelloV2(first: string, last: string): Promise<string>
{
    return `Hello, ${first} ${last}!`;
}
```

In this case both versions are in the same file, but to make them unique they both need to have a different name. Using the `as` property we can provide the alias.

```json
{
    "./domain/sayHello":
    {
        "sayHello": { "access": "public", "version": "1.0.0" },
        "sayHelloV2": { "access": "public", "version": "2.0.0", "as": "sayHello" }
    }
}
```

Now Jitar sees them as the same function and groups them together.

### Segmentation strategy

Depending on the size, complexity and type of application its modules can be placed into a single segment (like a monolith) or divided over multiple segments (like microservices). The segmentation of an application is dynamic and can change at any time without impacting the application code. This allows you to start simple and small, and gradually grow and split your application. We recommend using this approach.

### Optimizations and limitations

A module can be placed in more than one segment. This can be useful if a module is used in multiple segments. This prevents unnecessary network traffic because it's always locally available.

The segmentation system is module oriented, so a module can NOT be divided over multiple segments. If for example a module has two functions they must be placed in the same segment.

Functions that have multiple versions placed in separate modules also MUST be placed in the same segment. Jitar won't be able to group them otherwise.

### Unsegmented modules

Modules do not have to be placed in segments. In this case they're treated as shared and included automatically in all segments. These modules won't be a part of the segment definition, so its functions won't be registered.

Shared means that you don't have any access control, so these modules can be loaded by any client. To prevent any form of information leakage, this might be a situation you want to avoid. Use this wisely.
