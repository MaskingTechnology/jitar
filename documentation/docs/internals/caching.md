---
layout: doc

prev:
    text: Migrate away from Jitar
    link: /guides/migrate-away-from-jitar

next:
    text: Data serialization
    link: /internals/data-serialization

---

# Caching

Jitar serves applications from cache that is generated at the start of a [standalone service](../fundamentals/runtime-services#standalone) or [repository service](../fundamentals/runtime-services#repository). The cache contains generated code needed for distributing the application. By default the cache is placed in the `.jitar` folder, but can be configured differently. There are two types of cache. Both will be explained next.

Our goal is to give you a basic understanding of how Jitar works under the hood. We won't go into full detail here, but if you have any questions you can always [reach out to us](../community/get-help).

## Segments

For every segment configuration two cache files are generated. The first contains a list of module file names belonging to the segment. It's used by the repository service as a lookup list to determine if it needs to provide the actual or remote implementation of a module file.

```js
// {segment name}.segment.repository.js
export const files = [
    "file1.js",
    "file2.js"
];
```

The second contains the actual segment model that holds a full description for all its functions (called procedures in this context). It's used by the worker service to load their segments.

```js
// {segment name}.segment.worker.js
const { default : $1 } = await __import("./file1.js", "application", false);
const { a : $2, b : $3 } = await __import("./file2.js", "application", false);
const { Segment, /* more */} = await __import("jitar", "runtime", false);
export const segment = new Segment("default")
    .addProcedure(...)
   // …
```

Both cache files optimize the startup time of both services by prebaking the required information they need.

## Modules

For each module file, also two cache files are generated. Before diving in, let's look at a transpiled example module file first. 

```js
// file1.js
import fs from 'fs';
import { a, b } from './file2.js';

export async function function1(param1) { /* … */ }

export class Class1 { /* … */ }
```

The first generated cache file is a copy of the original file with a few modifications to make them work in a distributed setup.

```js
// file1.local.js
const fs = await __import("fs", "runtime");
const { a, b } = await __import("./file2.js", "application");

export async function function1(param1) { /* … */ }

export class Class1 { /* … */ }

Class1.source = "./file1.js"
```

In this file, all imports are rewritten to load them via Jitar runtime. All external imports (dependencies) are loaded at the runtime level with the module loader provided in the Jitar bootstrapper file. The application imports are loaded by the [repository service](../fundamentals/runtime-services#repository). Also, all classes are sourced to make them remotely loadable by [the serializer](./data-serialization).

The second contains the remote implementation of the segmented functions.

```js
// file1.remote.js
export async function function1(param1) {
    return __run('function1', '0.0.0', { 'param1': param1 }, this);
}
```

The classes can't be called remotely (only be loaded) and therefore not included in the remote files.
