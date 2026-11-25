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

### Module-Level Constants

- Define module-level constants before the class definition using `const UPPER_CASE = value`.
- Use `const DEFAULT_*` for default values (e.g., `DEFAULT_ROOT_PATH`, `DEFAULT_INTERVAL`).
- Use `const NAME_REGEX` for regex patterns.
- Use `const BREAK` or similar for string separators used in error messages.
- Private module-level constants (no `export`) are valid for internal formatting (e.g., `const BREAK = '\n => '`).

### Generics

- Classes can accept generic type parameters: `export default class ItemList<T>`.
- Use generic parameters when a class operates on or stores typed data.

### Interface Implementations

- When a class implements an interface, use `implements InterfaceName` after the class name.
- Example: `export default class LocalRepository implements Repository`.
- Interfaces are exported as default exports (`export default interface InterfaceName`).
- Interfaces are typed via `export type { default as InterfaceName }` in index files.

### Composition

- Classes that orchestrate multiple sub-components should receive them via the constructor (Dependency Injection).
- The orchestrator class composes its dependencies — it does not instantiate them internally unless necessary.
- Example: `ConfigurationManager` composes `EnvironmentConfigurator`, `RuntimeConfigurationBuilder`, and `ServiceConfigurationBuilder`.

### Sub-Manager Composition (Three-Layer Architecture)

- When a class coordinates multiple sub-operations, use a **facade pattern** with sub-managers.
- The facade (e.g., `SourcingManager`) implements the public interfaces and delegates to sub-managers (e.g., `FileManager`, `ImportManager`).
- Each sub-manager can itself compose sub-sub-managers (e.g., `LocalFileSystem`, `LocalModuleLocator`), creating a three-layer hierarchy.
- The facade exposes sub-managers via read-only getters so consumers can access them directly if needed.
- Concrete implementations of the facade compose concrete sub-managers in their constructors.
- Example hierarchy: `SourcingManager` → `FileManager` + `ImportManager` → `LocalFileSystem` + `LocalModuleLocator`.

### Manager Pattern

- Classes that manage a set of operations should be named with the `*Manager` suffix (e.g., `FileManager`, `ImportManager`, `SourcingManager`).
- Low-level adapters that wrap external dependencies (e.g., Node.js `fs`, `path`) should be named with the `*System` or `*Adapter` suffix (e.g., `LocalFileSystem`).
- This naming convention distinguishes management/coordination logic from low-level system adapters.

### Model Classes with Read-Only Getters

- Model/value classes that hold data should use private fields with read-only getter methods to expose properties.
- Private fields use `#camelCase` naming; getters use `get propertyName()` returning the private field.
- Example:

```ts
export default class File
{
    readonly #location: string;
    readonly #content: Buffer | string;

    constructor(location: string, content: Buffer | string)
    {
        this.#location = location;
        this.#content = content;
    }

    get location() { return this.#location; }

    get content() { return this.#content; }
}
```

### Get Method Pattern

- Use read-only getter methods to expose private fields: `get propertyName() { return this.#field; }`.
- Getters provide controlled read-only access to private state without exposing the field directly.
- Private getters (e.g., `get #internalState()`) are valid for internal class use.

### Placeholder Implementations

- When a feature is not yet supported, provide a placeholder/stub implementation that throws a descriptive error.
- All methods in the placeholder should throw the same error to make the unsupported state clear.
- Example: `RemoteFileSystem` where all operations throw `RemoteFilesNotSupported()`.
- Document clearly in the package's `AGENTS.md` that the implementation is a placeholder.

### Optional Parameters

- Use optional parameters with default values for optional arguments: `filename: string = DefaultValues.FILENAME`.
- Default values should reference module-level constants when they are used across the class.

### Required Methods

- **`clone()`** — Every model or stateful class must provide a `clone()` method that returns a deep copy of the instance.
- **`toString()`** — Every model class must provide a `toString()` method:
  - `toString()` returns the full string representation.
  - `toString(terminate: boolean)` optionally controls formatting (e.g., semicolon termination).
- **`fork()`** — Abstract manager classes should provide an abstract `fork(location: string)` method that concrete implementations override to create a new instance at a (possibly derived) location. The method should resolve the location (e.g., to an absolute path) before creating the new instance.

### Abstract Base Classes

- Use abstract base classes to define contracts when a hierarchy of related classes exists.
- Abstract methods must be declared with `abstract` keyword (e.g., `abstract clone(): ClassName;`).
- Subclasses must implement all abstract methods and return their own concrete type (covariant return types).
- Abstract manager classes can implement multiple interfaces to serve as a unified facade for sub-managers.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Classes | `PascalCase` | `FileManager`, `Serializer` |
| Private fields | `#camelCase` | `#rootLocation`, `#fileSystem` |
| Private methods | `#camelCase` | `#validateLocation`, `#rootLocation` |
| Interfaces | `PascalCase` (no `I` prefix) | `FileReader`, `FileSystem` |
| Types | `PascalCase` | `Module`, `Serialized` |
| Error classes | Descriptive, context-specific | `NotFound`, `ExpectedToken`, `InvalidLocation` |
| Module constants | `UPPER_CASE` | `DEFAULT_ROOT_PATH`, `DEFAULT_INTERVAL` |
| Default values object | `DefaultValues` (PascalCase, exported const) | `DefaultValues.FILENAME` |

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

### Type Definition Files

- Define type aliases as default exports: `export default TypeName;`.
- Group related **DefaultValues** (as a named exported const) and **validationScheme** (as a named exported const) in the same file as the type.
- Use `export { DefaultValues, validationScheme }` to expose shared values alongside the type.
- For discriminated unions (sub-type definitions), each sub-type has its own definition file with its own `validationScheme`.

### Sub-Module Index Files

- Each sub-module directory (e.g., `runtime/`, `service/`, `utils/`) should have its own `index.ts`.
- Re-export all public members from that sub-module using the `export { default as <Name> }` pattern.
- This allows consumers to import from the sub-module directly (e.g., `import { RuntimeConfiguration } from './runtime'`).

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

### Error Message Formatting

- Define private module-level constants for separators used in error messages (e.g., `const BREAK = '\n => '`).
- Format error messages to include the filename and the validation errors joined by the separator.
- Example: `Invalid runtime configuration '${filename}'${BREAK}${errorMessages}`.

## File Organization

- **1 file per logical component** (class, interface, type, or error).
- Shared types live under `src/types/`.
- Interfaces live under `src/interfaces/`.
- Error classes live under `src/errors/`.
- Definition constants live under `src/definitions/`.
- Index files re-export all public members via `export { default as <Name> }` pattern.

### Sub-Module Organization

- Group related components into sub-modules (e.g., `runtime/`, `service/`, `utils/`, `environment/`).
- Each sub-module should have its own `index.ts` that re-exports all public members.
- Sub-modules can have their own `errors/` and `definitions/` sub-directories.
- Example: `runtime/` may contain `ConfigurationBuilder.ts`, `definitions/RuntimeConfiguration.ts`, and `errors/RuntimeConfigurationInvalid.ts`.

## Import Conventions

- Import from within the monorepo using workspace aliases (`@jitar/...`).
- Import sibling package modules using relative paths (e.g., `../model`, `../../src/static`).
- Use `import type` for type-only imports to avoid runtime overhead.

### Import Ordering

- Order imports: external dependencies first, then core (workspace) dependencies, then runtime dependencies, then types.
- Group related imports together (e.g., all types from a package on one line).

## Testing

For testing, see the `write-test` skill.

## Reviewing

For reviewing, see the `code-review` skill.