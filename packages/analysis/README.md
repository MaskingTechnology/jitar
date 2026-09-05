
# Jitar Analysis

This package provides application analysis tools for the [Jitar](https://jitar.dev) runtime.

For more information about Jitar:

* [Visit our website](https://jitar.dev)
* [Read the documentation](https://docs.jitar.dev).

## TOOLS

Two tools are provided:

* **Reflector** - Extensive reflection (modules, classes, functions, objects and instances)
* **Parser** - Code parsing (modules, statements, imports, exports, variables, functions and classes)

Both tools return a shared based on the ECMAScript specification, but tailored to the Jitar runtime.

## KNOWN LIMITATIONS

The limitations below belong to the parser.

1. Generator as object properties are not supported

```ts
// Supported
function* myGenerator() { /* ... */ }

// Supported
class Foo =
{
    *generator1() { /* ... */ }

    async *generator2() { /* ... */ }

    static *generator3() { /* ... */ }
};

// Unsupported (dynamic properties won't be supported)
class Bar
{
  *[Symbol.iterator]() { /* ... */ }
}
```

2. Destructuring not fully supported

```ts
// Supported
const [ a, b = 42, ...others ] = myArray;
const { a, b = 42, ...others } = myObject;
```

```ts
// Aliases are not supported (will be supported)
const [ a, b: c, ...others ] = myArray;
const { a, b: c, ...others } = myObject;
```

```ts
// Dynamic property destructuring is not supported (will be supported)
const [ [a]: b ] = myArray;
const { [a]: b } = myObject;
```
