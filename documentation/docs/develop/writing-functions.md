---
layout: doc

prev:
    text: Application structure
    link: /develop/application-structure

next:
    text: Data sharing
    link: /develop/data-sharing

---

# Writing functions

Functions are the primary building blocks for Jitar applications. To ensure your application can be broken into segments and keep working after distribution, there are some rules to follow that will be explained here in detail.

### Export

Functions need to be exported in order to be loadable by Jitar. This can be any format you'd prefer. Functions can be exported directly like the example, or exported in a separate export statement like this.

```ts
async function sayHello(name: string): Promise<string> { /* … */ }

export { sayHello }
```

Default exports are also supported.

```ts
async function sayHello(name: string): Promise<string> { /* … */ }

export default sayHello;
```

Each function can be placed in a separate file, but they can also be combined and exported together.

```ts
async function sayHello(name: string): Promise<string> { /* … */ }
async function sayHi(name: string): Promise<string> { /* … */ }

export { sayHello as default, sayHi };
```

### Async

Functions need to be asynchronous in order to become distributable. The caller of the function does not know about its physical location. It might be locally available, but can also be on another server. Making a function asynchronous ensures that it can be run, no matter where the function resides. The `async` keyword is mandatory. Jitar will throw a `FunctionNotAsync` error if you try to distribute or replicate a non-async function.

### Parameters

Functions take any type of argument that can be [(de)serialized](./data-sharing.md#automatic-de-serialization).

Rest parameters are supported.

```ts
async function sayHello(...names: string[]): Promise<string> { /* … */ }
```

And parameter destructuring is supported.

```ts
async function sayHello({ name }: Person): Promise<string> { /* … */ }
```

::: warning IMPORTANT
Nested parameter destructuring is a known limitation and will be supported in future versions.
:::

### Return value

Functions can return any value that can be [(de)serialized](./data-sharing.md#automatic-de-serialization).

### Arrow functions

Arrow functions are NOT supported by the segmentation system, but can be safely used inside a segment.

```ts
// src/domain/sayHello.ts
export const sayHello = async (name: string): Promise<string> =>
{
    return `Hello, ${name}!`;
};
```

Trying to segment this function results into an error a build level.

### Importing and calling

Functions can be imported and called as if they are locally available.

```ts
// src/domain/example.ts
import { sayHello } from './sayHello';

export async function example(): Promise<void>
{
    const message = await sayHello('John');

    console.log(message);
}

// src/domain/sayHello.ts
export async function sayHello(name: string): Promise<string>
{
    return `Hello, ${name}!`;
}
```

Because the `sayHello` function is `async` we need to `await` it here.

In case the `sayHello` function is placed on another server, the example file will import a remote implementation of the function that is created by Jitar. This is why we need to make sure our function is `async`.

::: info NOTE
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
