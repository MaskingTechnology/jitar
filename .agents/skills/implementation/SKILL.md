---
name: implementation
description: Implement new features in one of the packages.
---

# Implementation

## Conventions

The `index.ts` file is always used to re-export public sources from a package.

## Class Structure

### Declaration

- Always use `export default class` for class definitions — never named exports.
- Private fields and methods use the JavaScript private syntax (`#`) with `#camelCase` naming.
- Private fields are declared at the top of the class body; private methods follow.

### Required Methods

- **`clone()`** — Every model or stateful class must provide a `clone()` method that returns a deep copy of the instance.
- **`toString()`** — Every model class must provide a `toString()` method:
  - `toString()` returns the full string representation.
  - `toString(terminate: boolean)` optionally controls formatting (e.g., semicolon termination).

### Abstract Base Classes

- Use abstract base classes to define contracts when a hierarchy of related classes exists.
- Abstract methods must be declared with `abstract` keyword (e.g., `abstract clone(): ClassName;`).
- Subclasses must implement all abstract methods and return their own concrete type (covariant return types).

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Classes | `PascalCase` | `FileManager`, `Serializer` |
| Private fields | `#camelCase` | `#rootLocation`, `#fileSystem` |
| Private methods | `#camelCase` | `#validateLocation`, `#rootLocation` |
| Interfaces | `PascalCase` (no `I` prefix) | `FileReader`, `FileSystem` |
| Types | `PascalCase` | `Module`, `Serialized` |
| Error classes | Descriptive, context-specific | `NotFound`, `ExpectedToken`, `InvalidLocation` |

## Export Patterns

### Index Files

Re-export all public types and classes using the `export { default as ClassName }` pattern:

```ts
export { default as ClassName } from './ClassName';
export type { Visibility as AliasedVisibility } from './ESClassMember';
```

### Main Entry Point (`src/index.ts`)

Group related exports together. Separate class exports from type exports:

```ts
export { ESBinding, ESVariable, ESFunction, ESClass, ... } from './model';
export { Reflector } from './dynamic';
export { Parser } from './static';
```

### Type Exports

- Use `export type` for type-only exports in index files.
- Re-export types with custom names when needed (e.g., `export type { Visibility as ClassVisibility }`).

## Error Handling

### Error Class Pattern

- Extend `Error` directly (or extend base errors from `@jitar/errors` when applicable).
- Use `export default class <Name> extends Error`.
- Constructor accepts an optional `message` parameter with a sensible default.
- Always call `super(message)` — do not add extra properties unless necessary.

### Error Naming

- Prefix parsing/analysis errors with `Expected` or `Unexpected` (e.g., `ExpectedToken`, `UnexpectedKeyword`).
- Use descriptive names for other errors (e.g., `NotFound`, `InvalidLocation`, `ClassNotFound`).
- Include relevant context in error messages (e.g., position information, filenames, values).

## File Organization

- **1 file per logical component** (class, interface, type, or error).
- Shared types live under `src/types/`.
- Interfaces live under `src/interfaces/`.
- Error classes live under `src/errors/`.
- Definition constants live under `src/definitions/`.
- Index files re-export all public members via `export { default as <Name> }` pattern.

## Import Conventions

- Import from within the monorepo using workspace aliases (`@jitar/...`).
- Import sibling package modules using relative paths (e.g., `../model`, `../../src/static`).
- Use `import type` for type-only imports to avoid runtime overhead.

## Testing

For testing, see the `write-test` skill.

## Reviewing

For reviewing, see the `code-review` skill.