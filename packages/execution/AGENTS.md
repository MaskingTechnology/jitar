# Execution Package Agent Guidelines

## Package Overview

The `@jitar/execution` package provides the core execution model for the Jitar runtime. It handles segmentation, procedure management, versioning, argument extraction, and error conversion. The package is **private** (`"private": true`) and is not published to npm — it is consumed internally by other Jitar packages (e.g., `@jitar/http`, `@jitar/services`).

## Dependencies

- `@jitar/errors` — Base error types (`BadRequest`, `NotFound`, `ServerError`, etc.) used by package-specific errors.
- `@jitar/sourcing` — `ModuleImporter` interface used by `ExecutionManager` to dynamically import segment modules.

All intra-monorepo imports must use workspace aliases (`@jitar/...`), never relative paths across packages.

## Source Code Structure

```
src/
├── definitions/          # Constants and type definitions
│   ├── AccessLevel.ts    # Access level constants (PRIVATE, PROTECTED, PUBLIC) + AccessLevel type
│   ├── RunModes.ts       # Run mode constants (NORMAL, DRY) + RunMode type
│   └── StatusCodes.ts    # HTTP-like status code constants (OK, BAD_REQUEST, SERVER_ERROR, etc.)
│
├── errors/               # Package-specific error classes
│   ├── ImplementationNotFound.ts
│   ├── InvalidParameterValue.ts
│   ├── InvalidVersionNumber.ts
│   ├── MissingParameterValue.ts
│   ├── ProcedureNotAccessible.ts
│   ├── ProcedureNotFound.ts
│   ├── UnknownParameter.ts
│   ├── StartingExecutionManagerFailed.ts
│   └── StoppingExecutionManagerFailed.ts
│
├── interfaces/           # Core interfaces
│   └── Runner.ts         # Runner interface with `run(request): Promise<Response>`
│
├── models/               # Domain model classes
│   ├── Application.ts    # Aggregates segments; provides class/procedure lookup across all segments
│   ├── Class.ts          # Represents a class with fqn and implementation
│   ├── Implementation.ts # Represents a procedure implementation with version, access level, parameters, and executable
│   ├── Parameter.ts      # Base parameter class (name, isOptional)
│   ├── NamedParameter.ts # Named (single-value) parameter — extends Parameter
│   ├── ArrayParameter.ts # Destructured array parameter — extends DestructuredParameter
│   ├── ObjectParameter.ts # Destructured object parameter — extends DestructuredParameter
│   ├── DestructuredParameter.ts # Destructured parameter with variables array
│   ├── Procedure.ts      # Procedure with multiple versioned implementations
│   ├── Request.ts        # Incoming request (fqn, version, args, headers, mode)
│   ├── Response.ts       # Outgoing response (status, result, headers)
│   ├── Segment.ts        # Segment containing classes and procedures
│   └── Version.ts        # Semantic version (major.minor.patch) with comparison methods
│
├── utils/                # Utility classes
│   ├── ArgumentConstructor.ts  # Extracts argument values from Map<string, unknown> based on parameter definitions
│   ├── ErrorConverter.ts       # Converts errors to status codes and vice versa
│   └── VersionParser.ts        # Parses version strings into Version objects
│
└── ExecutionManager.ts   # Main orchestrator: implements Runner, manages segments, runs procedures
```

## Error Handling

The execution manager distinguishes between **execution errors** and **application errors**:

- **Execution errors** are thrown and must be caught by the caller (e.g., `ProcedureNotFound`, `ImplementationNotFound`, `InvalidSegment`).
- **Application errors** are not part of the execution process — they are caught internally by `ExecutionManager.#runImplementation()` and wrapped in a `Response` with the appropriate status code via `ErrorConverter`.

### Package-Specific Error Pattern

All errors in this package:
1. Extend base error types from `@jitar/errors` (e.g., `ProcedureNotFound extends NotFound`).
2. Use the `#` private field prefix for error-specific data.
3. Set `this.name` to the class name in the constructor.
4. Provide getters for error-specific fields.
5. Export as `default` class.

```typescript
// Example error pattern
import { NotFound } from '@jitar/errors';

export default class ProcedureNotFound extends NotFound
{
    readonly #fqn: string;

    constructor(fqn: string)
    {
        super(`Procedure '${fqn}' not found`);

        this.name = 'ProcedureNotFound';

        this.#fqn = fqn;
    }

    get fqn() { return this.#fqn; }
}
```

## Core Concepts

### ExecutionManager

The `ExecutionManager` class is the primary entry point. It:
- Implements the `Runner` interface (`run(request): Promise<Response>`).
- Manages a collection of `Segment` objects via an internal `Application`.
- Supports lifecycle methods: `start()`, `stop()`, `loadSegment(filename)`, `addSegment(segment)`.
- Provides introspection: `getClassNames()`, `hasClass()`, `getClass()`, `getProcedureNames()`, `hasProcedure()`, `getProcedure()`.
- Executes procedures by resolving the implementation, extracting arguments, and calling the executable.

### Segment

A `Segment` groups related `Class` and `Procedure` objects, identified by a string `id`. It:
- Stores classes and procedures in `Map<string, Class>` and `Map<string, Procedure>` respectively.
- Provides `addClass(clazz)` and `addProcedure(procedure)` methods that return `this` for method chaining.
- Exposes `getExposedProcedures()` which filters to only public and protected procedures.

### Procedure

A `Procedure` represents a callable endpoint with multiple versioned `Implementation` objects. It:
- Stores implementations keyed by `Version` in a `Map<Version, Implementation>`.
- Tracks the latest (highest version) implementation automatically.
- Supports version fallback: `getImplementation(version)` returns the closest available version that is less than or equal to the requested version.

### Implementation

An `Implementation` wraps a callable function with its metadata:
- `version`: Semantic version of this implementation.
- `access`: Access level (`private`, `protected`, `public`).
- `parameters`: Array of `Parameter` objects describing expected arguments.
- `executable`: The actual function to invoke.

### Request / Response

- **Request**: Carries the procedure's fully qualified name (`fqn`), `Version`, arguments (`Map<string, unknown>`), headers (`Map<string, string>`), and run mode (`NORMAL` or `DRY`).
- **Response**: Carries an HTTP-like `status` code, a `result`, and optional `headers`.

### Parameter Types

The package supports three parameter types:
1. **NamedParameter**: A single named value (mandatory or optional).
2. **ArrayParameter**: A destructured array with typed variables.
3. **ObjectParameter**: A destructured object with typed variables.

Both `ArrayParameter` and `ObjectParameter` extend `DestructuredParameter`, which holds an array of `Parameter` variables.


## Coding Conventions

### Class Design
- Use `#` private field prefix for all class fields (e.g., `readonly #name: string;`).
- Use getters for public field access (e.g., `get name() { return this.#name; }`).
- Constructor-based initialization — no default values in property declarations.
- Builder methods that mutate state return `this` for method chaining.

### Naming Conventions
- **Classes**: PascalCase (e.g., `ExecutionManager`, `Segment`, `Procedure`).
- **Interfaces**: PascalCase with `Type` suffix implicitly (e.g., `Runner`).
- **Constants/Enums**: `const` objects with `UPPER_SNAKE_CASE` keys and `as const` assertion (e.g., `AccessLevels`, `RunModes`, `StatusCodes`).
- **Types derived from constants**: Union types using `typeof` (e.g., `AccessLevel = typeof AccessLevels[Keys]`, `RunMode = typeof RunModes[keyof typeof RunModes]`).

### Error Classes
- Extend base error types from `@jitar/errors`.
- Set `this.name` to the class name in the constructor.
- Provide getters for any additional error-specific data.

### Imports/Exports
- All intra-monorepo package imports use workspace aliases (`@jitar/errors`, `@jitar/sourcing`).
- Internal cross-file imports use relative paths from `./`.
- All classes are exported as `default`.
- Index file (`src/index.ts`) re-exports all public types organized by category (definitions, errors, interfaces, models, utils).

## Testing

### Test Structure

Tests follow the package's source code organization:

```
test/
├── ExecutionManager.spec.ts        # Integration tests for ExecutionManager
├── fixtures/                       # Shared test fixtures for top-level components
│   ├── executionManagers.fixture.ts
│   └── index.ts
└── models/                         # Model-specific tests
    ├── Application.spec.ts
    ├── Implementation.spec.ts
    ├── Procedure.spec.ts
    ├── Segment.spec.ts
    ├── Version.spec.ts
    └── fixtures/                   # Model-specific fixtures
        ├── applications.fixture.ts
        ├── executables.fixture.ts
        ├── implementations.fixture.ts
        ├── parameters.fixture.ts
        ├── procedures.fixture.ts
        ├── segments.fixture.ts
        ├── versions.fixture.ts
        └── index.ts
```

### Test Patterns

- Use Vitest with `describe`/`it`/`expect` structure.
- Tests are organized by method or property being tested (e.g., `describe('.run(request)', ...)`).
- Fixtures are exported as named objects (e.g., `SEGMENTS.GENERAL`, `PROCEDURES.PRIVATE`).
- Fixtures use method chaining for object construction (e.g., `new Segment('general').addProcedure(...)`).
- Async tests use `await expect(promise).rejects.toEqual(expectedError)`.
- Fixtures are centralized in `fixtures/` directories and re-exported via `index.ts`.

### Running Tests

```bash
npm run test          # Run all tests
npm run test-coverage # Run tests with v8 coverage
```

## Build

```bash
npm run build        # Build the package (outputs to dist/)
npm run clean        # Remove dist/ directory
```

## Key Implementation Details

### Version Resolution

When `Procedure.getImplementation(version)` is called:
1. It first looks for an exact version match.
2. If not found, it returns the highest available version that is less than the requested version.
3. If no version is less than or equal to the requested version, it returns `undefined`.
4. `Version.DEFAULT` (0.0.0) is used as the fallback base for comparison.

### Argument Extraction

`ArgumentConstructor.extract()` processes arguments as follows:
1. Arguments prefixed with `*` are treated as optional — they are only used if a matching parameter exists.
2. Named parameters are matched by name.
3. Array/Object (destructured) parameters have their variables extracted recursively.
4. Missing mandatory parameters throw `MissingParameterValue`.
5. Invalid rest parameters (not an array/object when expected) throw `InvalidParameterValue`.
6. Unknown remaining arguments throw `UnknownParameter`.

### Error Conversion

`ErrorConverter` maps error types to status codes:
- `BadRequest` → 400
- `Forbidden` → 403
- `NotFound` → 404
- `NotImplemented` → 501
- `PaymentRequired` → 402
- `Teapot` → 418
- `Unauthorized` → 401
- All others → 500 (ServerError)

The reverse mapping (`fromStatus`) creates the appropriate error type from a status code.

### DRY Run Mode

When a request has `mode === RunModes.DRY`, the `ExecutionManager` returns a `Response` with `StatusCodes.OK` and `undefined` result without executing the procedure. This is used for validation/pre-check purposes.

