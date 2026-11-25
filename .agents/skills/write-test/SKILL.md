---
name: write-test
description: for writing or updating tests for a package.
disabled: false
---

# Write Tests

## Framework & Tooling

- **Test framework**: Vitest — import `describe`, `expect`, `it` from `'vitest'`.
- **Test file extension**: `.spec.ts` (e.g., `MyClass.spec.ts`).
- **Test directory**: co-located with a `fixtures/` subdirectory inside `test/`.

## File Organization

```
test/
  MyService.spec.ts
  fixtures/
    index.ts              # re-exports everything from fixture modules
    myService.fixture.ts  # named constants or runtime objects
    anotherFixture.ts
```

- **Spec files**: `test/<domain>/<ClassName>.spec.ts`
- **Fixture files**: `test/<domain>/fixtures/<name>.fixture.ts`
- **Re-export index**: `test/<domain>/fixtures/index.ts` — always re-export from every fixture module using `export * from './<name>.fixture';`.

## Fixture Patterns

Fixtures encapsulate test data and should be imported from `'./fixtures'` (or `'./fixtures/<name>'` when the index does not re-export them).

### 1. String Fixtures

For parsing or serialization tests, define code strings as named constants:

```typescript
export const CODE =
{
    VALUES: '42 hello "world" true false undefined null',
    STATEMENT: `const identifier = (12 >= 3) ? { 'foo' } : [ "bar" ];`,
    REGEX_STATEMENT: `const regex = /[\\"]['"]/g.test('foo')`
};
```

### 2. Runtime Object Fixtures

For reflection or runtime-introspection tests, define actual classes, functions, or instances:

```typescript
class Parent { ... }
class Child extends Parent { ... }

export const CLASSES = { Parent, Child };
```

### 3. Instance Fixtures

Pre-constructed instances for testing object-level behavior:

```typescript
export const OBJECTS =
{
    PLAIN:  { id: 2, fullName: 'Jane Doe', age: 42 },
    CLASS:  new CLASSES.Child(1, 'John', 'Doe', 42),
    ERROR:  new Error('Plain error')
};
```

### 4. Model Object Fixtures

For testing model-level APIs, construct model instances directly:

```typescript
const members =
[
    new ESField('name', 'private', 'instance', new ESExpression('"Peter"')),
    new ESGetter('name', 'public', 'instance', new ESBlock('{ return this.#name; }'))
];

export const esClass = new ESClass('Person', undefined, members);
```

### 5. Fixture Index (`index.ts`)

Always re-export all fixtures:

```typescript
export * from './classes.fixture';
export * from './code.fixture';
export * from './values.fixture';
```

## Test Structure

### Nesting Convention

```typescript
import { describe, expect, it } from 'vitest';

import { MyClass } from '../../src/myModule';

import { FIXTURE } from './fixtures';

describe('MyClass', () =>
{
    describe('.methodName(args)', () =>
    {
        it('should <description of expected behavior>', () =>
        {
            // Arrange
            const instance = new MyClass();

            // Act
            const result = instance.methodName(FIXTURE.SOMETHING);

            // Assert
            expect(result).toEqual(expectedValue);
        });
    });

    describe('.anotherMethod()', () =>
    {
        it('should <positive case>', () => { ... });
        it('should <negative case>', () => { ... });
    });
});
```

- Top-level `describe`: the class or module being tested.
- Nested `describe`: the method, property, or feature under test. Use the format `.methodName(args)` for methods, `.propertyName` for getters/setters.
- `it`: a single test case. Start with `"should "` followed by a human-readable description of the expected behavior.

## Assertion Patterns

| Assertion | Usage |
|---|---|
| `.toEqual(value)` | Deep equality — values, strings, identifiers |
| `.toHaveLength(n)` | Array or collection length |
| `.toBeInstanceOf(Constructor)` | Type checking for model classes |
| `.toBeTruthy()` / `.toBeFalsy()` | Boolean assertions |
| `.toBeDefined()` | Non-null / non-undefined check |
| `.toBe(booleanLiteral)` | Strict boolean comparison (`true` / `false`) |

### Chained Assertions

Assert on nested properties and sub-objects sequentially:

```typescript
it('should parse a function with parameters', () =>
{
    const funktion = parser.parseFunction(FUNCTIONS.PARAMETERS);
    expect(funktion.identifier).toEqual('name');
    expect(funktion.isAsync).toBeFalsy();
    expect(funktion.parameters).toHaveLength(2);

    const first = parameters[0];
    expect(first.binding).toBeInstanceOf(ESIdentifierBinding);
    expect(first.binding.toString()).toEqual('param1');
    expect(first.initializer).toBeUndefined();

    const second = parameters[1];
    expect(second.binding).toBeInstanceOf(ESIdentifierBinding);
    expect(second.binding.toString()).toEqual('param2');
    expect(second.initializer).toBeUndefined();
});
```

### Type Casting

When a method returns a union type but the test expects a specific subclass, cast explicitly:

```typescript
const variable = parser.parseVariable(FUNCTIONS.ARROW);
expect(variable.initializer).toBeInstanceOf(ESArrowFunction);

const funktion = variable.initializer as ESArrowFunction;
expect(funktion.identifier).toBeUndefined();
```

### Destructuring Assertions

For arrays with known length, use destructuring for cleaner access:

```typescript
const [name1, name2, name3] = module.variables;

expect(name1.identifier).toEqual('name1');
expect(name2.identifier).toEqual('name2');
expect(name3.identifier).toEqual('name3');
```

## General Guidelines

- **Allman brace style**: Open braces on a new line (enforced by ESLint).
- **Single instance per spec**: Create the SUT (system under test) once at the top level when possible:

  ```typescript
  const reflector = new Reflector();
  ```

- **Import path convention**: Source modules use `'../../src/...'` (two levels up from `test/` to package root, then into `src/`). Fixtures use `'./fixtures'` or `'./fixtures/<name>'`.
- **No inline ESLint disables** unless absolutely necessary — consult `CODING_STANDARDS.md` before suppressing any rule.
- **Run `npm run lint`** after creating or modifying test files to verify formatting.

