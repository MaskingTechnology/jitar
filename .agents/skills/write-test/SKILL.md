---
name: write-test
description: for validating, writing or updating tests for a package.
---

# Write Tests

## Framework & Tooling

- **Test framework**: Vitest — import `describe`, `expect`, `it` from `'vitest'`.
- **Test file extension**: `.spec.ts` (e.g., `MyClass.spec.ts`).
- **Test directory**: shared `fixtures/` subdirectories inside `test/`, at the same level as (or nested with) spec files.

## File Organization

```
test/
  ExecutionManager.spec.ts
  fixtures/
    index.ts              # re-exports everything from fixture modules
    executionManagers.fixture.ts
  models/
    Application.spec.ts
    fixtures/
      index.ts            # re-exports from this domain's fixture modules
      applications.fixture.ts
      segments.fixture.ts
```

- **Spec files**: `test/<domain>/<ClassName>.spec.ts` (or `test/<domain>/<Subdomain>/<ClassName>.spec.ts`).
- **Fixture files**: `test/<domain>/fixtures/<name>.fixture.ts` (or `test/<domain>/fixtures/<name>.fixture.ts`).
- **Re-export index**: `test/<domain>/fixtures/index.ts` — always re-export from every fixture module using `export * from './<name>.fixture';`.

### Fixture Import Paths

Fixtures encapsulate test data and should be imported from `'./fixtures'` (or `'./fixtures/<name>'` when the index does not re-export them). The import path is relative to the spec file's location:

```
test/ExecutionManager.spec.ts        → import { EXECUTION_MANAGERS } from './fixtures';
test/models/Application.spec.ts      → import { APPLICATIONS } from './fixtures';
test/utils/ArgumentConstructor.spec.ts → import { ARGUMENTS } from './fixtures';
```

## Fixture Patterns

Fixtures encapsulate test data and should be imported from `'./fixtures'` (or `'./fixtures/<name>'` when the index does not re-export them). The import path is always relative to the spec file's location.

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

### Test Phases

Every `it` block should follow the **Arrange-Act-Assert** structure:

1. **Arrange** — Set up the test environment: create instances, prepare fixtures, configure state.
2. **Act** — Invoke the method or operation under test.
3. **Assert** — Verify the result with expectations.

The `// Arrange`, `// Act`, `// Assert` comments in the nesting convention example illustrate this three-phase structure. They are not required literal comments in every test, but the three-phase structure they represent must be respected to keep tests structured and readable. For simple tests, the phases may be implicit (a single expression covering all three), but the logical separation must still be clear.

### Async Tests

When testing async methods, declare the test body as `async` and use `await` for promises:

```typescript
it('should run an existing procedure implementation', async () =>
{
    const request = new Request('public', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

    const response = await executionManager.run(request);

    expect(response.result).toBe('public');
});
```

### Async Rejection Tests

For testing error cases with async methods, capture the promise and use `.rejects`:

```typescript
it('should not add an invalid segment', async () =>
{
    const promise = executionManager.addSegment({} as Segment);

    await expect(promise).rejects.toEqual(new InvalidSegment());
});
```

## Assertion Patterns

| Assertion | Usage |
|---|---|
| `.toEqual(value)` | Deep equality — values, strings, identifiers |
| `.toBe(value)` | Strict equality — primitives, strings, numbers |
| `.toBeTypeOf(type)` | Type checking — `'number'`, `'string'`, etc. |
| `.toHaveLength(n)` | Array or collection length |
| `.toBeInstanceOf(Constructor)` | Type checking for model classes |
| `.toBeTruthy()` / `.toBeFalsy()` | Boolean assertions |
| `.toBeDefined()` | Non-null / non-undefined check |
| `.toBeUndefined()` | Explicit undefined check |
| `.not.toBeUndefined()` | Negated undefined check |
| `.toBe(booleanLiteral)` | Strict boolean comparison (`true` / `false`) |
| `.toThrow(err)` | Synchronous error throwing |
| `.toThrowError(err)` | Synchronous error throwing (alias) |
| `.rejects.toEqual(err)` | Async rejection (error) matching |
| `.resolves.toEqual(value)` | Async resolution (value) matching |
| `.resolves.toBeDefined()` | Async resolution (non-undefined) check |

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
- **Single or multiple instances per spec**: Create the SUT (system under test) at the top level when possible. When multiple instances are needed, create them all at the top level:

  ```typescript
  const reflector = new Reflector();
  const privateImplementation = IMPLEMENTATIONS.PRIVATE;
  const publicImplementation = IMPLEMENTATIONS.PUBLIC;
  ```

- **Import path convention**: Source modules use `'../src/...'` for top-level specs, `'../../src/...'` for specs one level deep, and `'../../../src/...'` for specs two levels deep. Fixtures use `'./fixtures'` or `'./fixtures/<name>'`.
- **Type-only imports**: Use `import type` when a class is needed only for type annotations:

  ```typescript
  import type Segment from '../src/models/Segment';
  ```

- **Inline comments in fixtures**: Use inline comments to explain fixture purpose or state:

  ```typescript
  NAMED_OPTIONAL: new Map(Object.entries({ 'id': 1, 'name': 'John Doe' })), // Misses the age
  ```

- **No inline ESLint disables** unless absolutely necessary — consult `CODING_STANDARDS.md` before suppressing any rule.
- **Run `npm run lint`** after creating or modifying test files to verify formatting.

