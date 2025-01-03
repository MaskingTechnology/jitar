---
layout: doc

prev:
    text: Quick start
    link: /introduction/quick-start

next:
    text: Runtime services
    link: /fundamentals/runtime-services

---

# Building blocks

If you're familiar with modern JavaScript / TypeScript, then you already know a lot. Because Jitar is a runtime, applications are built with pure JavaScript / TypeScript. The only thing you need to know is that Jitar applications are procedural by nature and functions are the primary building blocks for building them. Classes can be used as secondary building blocks for utils and state.

For breaking applications into distributable pieces, Jitar uses a segmentation system. A segment defines what modules need to be deployed together. Jitar connects these segments by creating [RPC endpoints](../integrate/rpc-api) and requests for function calls under the hood. Class instance arguments will be shared using Jitar's [automatic (de)serialization](../develop/data-sharing#automatic-de-serialization) system.

In this section you'll learn about using functions and classes, and creating segments to create scalable applications.

## Functions

Plain functions are used as primary building blocks for applications. Let's see how a simple function looks like.

```ts
// src/domain/sayHello.ts
export async function sayHello(name: string): Promise<string>
{
    return `Hello, ${name}!`;
}
```

If you're already familiar with writing async functions, this shouldn't be anything new. Because Jitar applications are distributable, there are some rules to follow.

### Rules of engagement

To ensure your application can be broken into segments and keeps working after distribution, the following rules apply to segmented functions:

1. Need to be async (require the async keyword)
1. Must be exported (named or as default)
1. Must be stateless / pure (don't depend on global values)

As long as you follow these rules, all will be fine. One thing to keep in mind is that arrow functions are supported, but can only be safely used in a non-distributed context. Meaning that the function does not call another function that might be in another segment. Besides that, we don't like to mix styles and recommend writing normal functions in any case.

More in depth information on writing functions and the rules can be found in the [DEVELOP section](../develop/writing-functions).

### Fully qualified name (FQN)

Every function has a unique name used for internal and external identification. This name is called the fully qualified name (FQN) and constructed with the location and the name of the function in the following format.

```txt
{ location relative to the source folder }/{ function name }
```

For the simple sayHello function the FQN of this function is `domain/sayHello`. **Note** that there is no leading / in the name.

## Classes

Plain classes can be used for creating utilities or sharing state between the functions. Both use-cases are explained in detail below.

### Utility

Utility classes provide common logic used throughout the whole application. For example, a logger:

```ts
// src/domain/Logger.ts
export class Logger
{
    log(level: string, message: string)
    {
        console.log(`[${level}] ${message}`);
    }
}
```

These kinds of classes typically do not hold any state, and their instances are not shared between functions.

### State

For sharing state, class instances can be used as long as the instance is reconstructible at the other end. By this we mean that the exposed values can be put back in the instance via:

* The constructor
* Public field
* Setter

Let's look at an example.

```ts
// src/domain/Person.ts
export class Person
{
    #name: string;
    #age: number;

    constructor(name: string, age: number)
    {
        this.#name = name;
        this.#age = age;
    }

    get name(): string { return this.#name; }
    get age(): number { return this.#age; }
}
```

This class complies with the rules because all the exposed values (name and age) can be set via the constructor. More information about this can be found on the [data sharing page](../develop/data-sharing).

## Segments

Segments are used to break applications down into distributable pieces. Jitar's segmentation system is module oriented. This means that a segment groups module files that need to be deployed together.

For the definition of a segment, JSON files are used and placed in a `segments` folder. These files contain the segment configuration. Let's see how a simple configuration looks like.

```json
// segments/default.json
{
    "./domain/sayHello":
    {
        "sayHello":
        {
            "access": "public",
            "version": "0.0.0",
            "as": "sayHello"
        }
    },
    "./domain/Person": {},
}
```

### Configuration options

This configuration connects very well with the JavaScript module system. It includes exported functions from one or more module files with four configuration options:

1. Exposed functions per module file
1. Access level per function (public / protected / private, default private)
1. Version number per function (optional, default 0.0.0)
1. Alternative name (optional, default the name of the function)

The example configuration exposes the `sayHello` function from the `./domain/sayHello` module file. The function has public access, meaning that it's accessible from other segments. Both the version and as properties have the default value, so these can optionally be removed.

::: info CLASSES
These configuration options do NOT apply to classes because they are not a functional part of Jitar. Therefore, classes only need to be registered. Keep in mind that state classes need to be registered in all dependent segments (sender and receiver) to be (de)serializable. Utility classes are commonly used across multiple segments and, therefore, do not require segmentation.
:::

More in depth information on segments and the configuration can be found in the [DEPLOY section](../deploy/segmentation).

### Automated orchestration

Functions can be divided over multiple segments, even if they depend on each other. If for example a function contains an implementation of a (business) process that depends on the result of other functions, these functions do not have to be placed in the same segment.

Jitar automates the orchestration of a function execution, and is able to find and run any function no matter its physical location.
