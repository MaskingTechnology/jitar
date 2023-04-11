
# Reflection package for Jitar

This package is used for reading and splitting [Jitar](https://jitar.dev) applications.

To add this package to your project run:

```bash
npm install @jitar/reflection
```

For more information about Jitar:

* [Visit our website](https://jitar.dev)
* [Read the documentation](https://docs.jitar.dev).

## Known limitations

1. Declaration of multiple values is not supported

```ts
// Supported
const a = 1;
export { a }

// Unsupported (will be supported)
const b = 2, c = 3;
export { b, c }
```

2. Generator as object properties are not supported

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

3. Destructuring not fully supported

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
// Nested destructuring is not supported (will be supported)
const [ a, [ b = 42, c, d ] ] = myArray;
const { a: { c, d = true }, b = 42 } = myObject;
```

```ts
// Dynamic property destructuring is not supported (won't be supported)
const [ [a]: b ] = myArray;
const { [a]: b } = myObject;
```
