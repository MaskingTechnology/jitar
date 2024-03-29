
# Jitar Reflection

This package provides static and dynamic reflection for JavaScript applications. It's used in the [Jitar](https://jitar.dev) project for analyzing and splitting applications, but can also be used as standalone library in any project.

To add this package to your project run:

```bash
npm install @jitar/reflection
```

For more information about Jitar:

* [Visit our website](https://jitar.dev)
* [Read the documentation](https://docs.jitar.dev).

## Usage

### Static reflection

For static reflection the reflector provides functions for parsing and analyzing JavaScript code:

* `parse(code: string)` - Parses JS code into a ReflectionModule model
* `parseClass(code: string)` - Parses a class declaration statement into a ReflectionClass model
* `parseFunction(code: string)` - Parses a function declaration statement into a ReflectionFunction model
* `parseField(code: string)` - Parses a const / let /var declaration statement into a ReflectionField model
* `parseImport(code: string)` - Parses an import statement into a ReflectionImport model
* `parseExport(code: string)` - Parses an export statement into a ReflectionExport model

### Dynamic reflection

For dynamic reflection the reflector provides function for analyzing JavaScript classes and objects:

* `fromModule(module: object)` - Parses a module (its fields, functions and classes) into a ReflectionModule model
* `fromClass(clazz: Function)` - Parses a class into a ReflectionClass model
* `fromObject(object: object)` - Parses an object (class instance) into a ReflectionClass model
* `fromFunction(funktion: Function)` - Parses a function into a ReflectionFunction model

### Helper functions

The reflector also provides other helper functions:

* `createInstance(clazz: Function, args: unknown[])` - Creates a new class instance
* `isClassObject(object: object)` - Checks if the object is a class instance
* `getClass(object: object)` - Gets the class from an instance object
* `getParentClass(clazz: Function)` - Gets the parent class from a class


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
