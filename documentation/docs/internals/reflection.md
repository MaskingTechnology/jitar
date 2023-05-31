---
layout: doc

prev:
    text: Data serialization
    link: /internals/data-serialization

next:
    text: Concept examples
    link: /examples/concepts

---

# Reflection

Jitar combines static and dynamic reflection techniques for automating the end-to-end communication. In this section you'll find more information on this topic.

Note: The reflection is available as a separate NPM package that you can use in your own project. You can find more information on this in the [readme of the package](https://github.com/MaskingTechnology/jitar/blob/main/packages/reflection/README.md){target="_blank"}.

## Use cases

For creating [application cache](./caching), static reflection is used to read the module files (code) and extract the needed information like its imports, exports, functions and classes.

For the [(de)serialization](./data-serialization) of complex objects, dynamic reflection is used for extracting reconstruction information like fields, getters / setters and constructor parameters.

## Known limitations

There are some known limitations to the static reflection. Most do not apply to the Jitar use cases, but have to be taken into account when using this package in your own project. Some limitations will be supported in a future version, but others simply can't be supported.

The limitations that apply to Jitar applications are explained below. The full list can be found in the [readme of the package](https://github.com/MaskingTechnology/jitar/blob/main/packages/reflection/README.md){target="_blank"}.

### Parameter destructuring aliases

Aliases in destructuring are not supported yet, but will be supported in future versions.

```ts
async function sayHello({name: fullName}: Person) { /* … */ }
```

### Nested destructuring

Nesting in destructuring is not supported yet, but will be supported in future versions.

```ts
async function sayHello({name, address: {city}}: Person) { /* … */ }
```

### Dynamic property destructuring

Dynamic properties in destructuring are not supported and won't be supported because static reflection is used for reading the parameters.

```ts
const key = 'name';

async function sayHello({[key]: fullName}: Person) { /* … */ }
```
