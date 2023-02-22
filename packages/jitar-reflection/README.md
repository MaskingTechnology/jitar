
# Reflection package for Jitar

This package is used for reading and splitting [Jitar](https://jitar.dev) applications.

To add this package to your project run:

```bash
npm install jitar-reflection
```

For more information about Jitar:

* [Visit our website](https://jitar.dev)
* [Read the documentation](https://docs.jitar.dev).

## Known limitations

Declaration of multiple values is not supported

```ts
const a = 1, b = 2, c = 3;

// Only a is defined, b and c are undefined
export { a, b, c }
```
