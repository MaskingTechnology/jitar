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
Functions need to be asynchronous in order to become distributable. The caller of the function does not know about its physical location. It might be locally available, but can also be on another server. Making a function asynchronous ensures that it can be run, no matter where the function resides. The async keyword is mandatory. Jitar will throw a `FunctionNotAsync` error if you try to distribute or replicate a non-async function.

### Parameters
Functions take any type of argument that can be (de)serialized.

Rest parameters are supported:

```ts
async function sayHello(...names: string[]): Promise<string> { /* … */ }
```

And parameter destructuring is supported:

```ts
async function sayHello({ name }: Person): Promise<string> { /* … */ }
```

### Return value
Functions can return any value that can be (de)serialized.

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