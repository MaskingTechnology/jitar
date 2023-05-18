---
layout: doc

prev:
    text: Quick start
    link: /introduction/quick-start

next:
    text: Runtime services
    link: /fundamentals/runtime-services

---

# Overview
If you're familiar with modern JavaScript / TypeScript, then you already know a lot. Because Jitar is a runtime, applications are built with pure JavaScript / TypeScript. The only thing you need to know is that Jitar applications are procedural by nature and functions are the primary building blocks for building them.

For breaking applications into distributable pieces, Jitar uses a segmentation system. A segment defines what modules need to be deployed together. Jitar connects these segments by creating RPC endpoints and requests under the hood.

In this section you'll learn about using functions and creating segments to create scalable applications.

## Functions
Plain functions are used as primary building blocks for applications. But there are some rules that apply to ensure your application can be broken into segments and keep working after distribution. Let's see how a simple function looks like:

```ts
export async function sayHello(name: string): Promise<string>
{
    return `Hello, ${name}!`;
}
```

If you're already familiar with writing async functions, this shouldn't be anything new. Let's decompose the function and dive into the details.

### Export
Functions need to be exported in order to be loadable by Jitar. This can be any format you'd prefer. Functions can be exported directly like the example, or exported in a separate export statement like this:

```ts
async function sayHello(name: string): Promise<string> { /* … */ }

export { sayHello }
```

Default exports are also supported:

```ts
async function sayHello(name: string): Promise<string> { /* … */ }

export default sayHello;
```

Each function can be placed in a separate file, but they can also be combined and exported together:

```ts
async function sayHello(name: string): Promise<string> { /* … */ }
async function sayHi(name: string): Promise<string> { /* … */ }

export{ sayHello as default, sayHi };
```

### Async
Functions need to be asynchronous in order to become distributable. The caller of the function does not know about its physical location. It might be locally available, but can also be on another server. Making a function asynchronous ensures that it can be run, no matter where the function resides. The `async` keyword is mandatory. Jitar will throw a `FunctionNotAsync` error if you try to distribute or replicate a non-async function.

### Parameters
Functions take any type of argument that [can be (de)serialized](../develop/data-sharing.md#automatic-deserialization).

Rest parameters are supported:

```ts
async function sayHello(...names: string[]): Promise<string> { /* … */ }
```

And parameter destructuring is supported:

```ts
async function sayHello({ name }: Person): Promise<string> { /* … */ }
```

### Return value
Functions can return any value that [can be (de)serialized](../develop/data-sharing.md#automatic-deserialization).

### Arrow functions
Arrow functions are supported, but come with an important limitation. Jitar uses the function's `this` to pass context information (headers) for creating remote calls. Array functions do not have a `this` and can't provide any context.

```ts
export const sayHello = (name: string) => { /* … */ };
```

This example works with the default Jitar setup, but will break when using middleware that sets additional headers like authorization. To avoid this we recommend using normal functions in any situation.

### Importing and calling
Functions can be imported and called as if they are locally available.

```ts
// shared/example.ts
import { sayHello } from './sayHello';

export async function example(): Promise<void>
{
    const message = await sayHello('John');

    console.log(message);
}

// shared/sayHello.ts
export async function sayHello(name: string): Promise<string>
{
    return `Hello, ${name}!`;
}
```

Because the `sayHello` function is `async` we need to `await` it here.

In case the `sayHello` function is placed on another server, the example file will import a remote implementation of the function that is created by Jitar. This is why we need to make sure our function is `async`.

::: info
Imports do not require an extension. Jitar makes sure that all your imports work at runtime.
:::

### Prepare for scalability
Distributing and replicating functions over multiple servers can lead to unexpected behavior when a function isn't prepared for this. Let's look at an example:

```ts
let counter = 0;

export async function count(): Promise<number>
{
    return ++counter;
}
```

This function has a dependency on the counter variable outside its own scope. Distributing or replicating this function will break the expected behavior because the value of the counter is not shared between servers. Each server will hold its own counter value.

To prevent any unexpected side effects requires keeping your functions as stateless as possible. If a function depends on shared state, make sure to use a state component or a shared storage solution.

### Performance optimization
The async system comes with a performance penalty. Therefore it's recommended to avoid using it for functions that won't be distributed or replicated by Jitar and do not return a promise.

## Segments
Segments are used to break applications down into distributable pieces. A segment groups module files that need to be deployed together. Its definition is placed into a JSON segment file. Let's look at a simple example file named `default.segment.json`:

```json
{
    "./shared/sayHello":
    {
        "sayHello": {  "access": "public" }
    }
}
```

This example includes the `sayHello` function from the `shared/sayHello.ts` module file. Now let's decompose the configuration file and dive into the details.

### Naming and placement
Jitar uses the configuration filename for identifying segments. There is no mandatory location for placing segment configuration files, so Jitar uses the `.segment.json` extension for scanning them in the project.

Segments are named, and their names are derived from the filename. Everything that is in front of the `.segment.json` extension is used as the name. So for the filename `default.segment.json` the segment is named 'default'.

::: info
Although there is no mandatory location for these files, we always place them in a segment folder in the root directory of the project. We've done this for all our projects and examples and made finding them very easy.
:::

### Configuration structure
A segment file works like the JavaScript module system. It defines what to import from from what module file. Its basic structure looks like this:

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

::: warning
All imported functions must be async. Jitar will throw a `FunctionNotAsync` error if you try to import a non-async function.
:::

The module file specifier does not require an extension. It will automatically look for the (compiled) .js file when loading the module. The source folder is used as the root location, so you can use relative paths.

The import names must correspond with the export names in the module. You can also import the default:

```json
{
    "./shared/sayHello":
    {
        "default": { "access": "public" },
        "another": { "access": "public" },
       …
    }
}

```

Imports have multiple properties that can be configured. These properties will be explained next.

### Access protection
Segments enable deploying application pieces on different servers. This requires functions to be remotely accessible to make sure the application keeps working. But it also introduces a security risk that needs to be addressed. The access property sets the basic access level of a function. For example:

```json
{
    "./shared/secret":
    {
        "getSecret": { "access": "private" },
        "useSecret": { "access": "public" }
    }
}
```

By default a function has private access. This means that the function can only be called within its own segment, and can not be called from outside. Functions that need to be accessible from outside need to have the public access level.

::: tip
To protect the access to public functions [authentication and authorization](../develop/security.md#authentication-and-authorization) needs be applied.
:::

### Versioning
Jitar generates an endpoint for each public function. These endpoints are used for automating the internal communication, but can also be used by external applications with [our RPC API](../leftovers/rest-apis.md#rpc). To control the implementation of breaking changes in external applications, Jitar supports providing multiple versions of functions.

For example, if we need to update our sayHello function to split the name parameter into a separate first and last parameter, we can implement it like this:

```ts
// shared/sayHelloV2.ts
export async function sayHello(first: string, last: string): Promise<string>
{
    return `Hello, ${first} ${last}!`;
}
```

Now we have a separate module file per version that can be registered in the segment configuration with their own version:

```json
{
    "./shared/sayHello":
    {
        "sayHello": { "access": "public", "version": "1.0.0" }
    },
     "./shared/sayHelloV2":
    {
        "sayHello": { "access": "public", "version": "2.0.0" }
    }
}
```

Jitar groups functions by name and registers them by version. In this case both functions are available for use and are called with a specific version.

::: tip
When registering the same version multiple times, Jitar will provide …
:::

### Aliases
By default the import names are used for registering functions. In some cases you might want to expose a function under an alias name. A common use case is to create unique names in case multiple modules have equal exports or when combining multiple versions in a single module file. For example combining the sayHello functions:

```ts
// shared/sayHello.ts
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
    "./shared/sayHello":
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

### More information
If you want to know more about setting up an application, you can take a look at the [app structure section](../develop/application-structure.md).

For further learning on how to write your functions for scale, we've created a [build for scale tutorial](../tutorials/build-for-scale.md).
