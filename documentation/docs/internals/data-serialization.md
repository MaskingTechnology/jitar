---
layout: doc

prev:
    text: Caching
    link: /internals/caching

next:
    text: Reflection
    link: /internals/reflection

---

# Data serialization

Jitar comes with a powerful (de)serializer that is used for sharing data between nodes. In this section you'll find more information on this topic..

Note: The serializer is available as a separate NPM package that you can use in your own project. You can find more information on this in the [readme of the package](https://github.com/MaskingTechnology/jitar/blob/main/packages/serialization/README.md){target="_blank"}.

## Build-in serializers

We try to support all JavaScript built-in types. Currently we support:

* Primitives (bool, number, string, etc.)
* Objects (plain and class instances)
* Collections (Array, Map and Set)
* Data buffers (Typed Arrays)
* Big integers
* Regular expressions
* Others (Date and URL)

## Adding your own

The serialization package is open for implementing your own serializers in case your application has special (de)serialization needs. This can be done by creating a custom serializer and adding it to the server. Documentation how to build a custom serializer can be found in the [readme](https://github.com/MaskingTechnology/jitar/blob/main/packages/serialization/README.md){target="_blank"} of the serialization package.

```ts
//src/jitar.ts
import { buildServer } from 'jitar';

import CustomSerializer from './CustomSerializer.js';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await buildServer(moduleImporter);
server.addSerializer(new CustomSerializer());
server.start();
```

Jitar uses a default class loader. If you need the class loader in your custom serializer you can get it from the server instance.

```ts
const classLoader = server.classLoader;
```
