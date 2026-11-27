# @jitar/execution

This file extends the root [`AGENTS.md`](../../AGENTS.md) with package-specific information.

## Purpose

This package provides the core execution model for the Jitar runtime. It handles segmentation, procedure management, versioning, argument extraction, and error conversion. The package is **private** (`"private": true`) and is not published to npm — it is consumed internally by other Jitar packages (e.g., `@jitar/http`, `@jitar/services`).

## Exports

All exports come from `src/index.ts` (single entry point, `"exports": "./dist/index.js"`), organized by category (definitions, errors, interfaces, models, utils).

| Exported Symbol | Type | Description |
|-----------------|------|-------------|
| `AccessLevels` | const | Access level constants (`PRIVATE`, `PROTECTED`, `PUBLIC`) |
| `AccessLevel` | type | Union type of the access level values |
| `RunModes` | const | Run mode constants (`NORMAL`, `DRY`) |
| `RunMode` | type | Union type of the run mode values |
| `StatusCodes` | const | HTTP-like status code constants (`OK`, `BAD_REQUEST`, `UNAUTHORIZED`, `PAYMENT_REQUIRED`, `FORBIDDEN`, `NOT_FOUND`, `TEAPOT`, `SERVER_ERROR`, `NOT_IMPLEMENTED`) |
| `ImplementationNotFound` | class | Error: no implementation matches the requested version |
| `InvalidParameterValue` | class | Error: a (rest) parameter value has an invalid type |
| `InvalidVersionNumber` | class | Error: a version string cannot be parsed |
| `MissingParameterValue` | class | Error: a mandatory parameter has no value |
| `ProcedureNotAccessible` | class | Error: the procedure is not accessible |
| `ProcedureNotFound` | class | Error: the procedure does not exist |
| `UnknownParameter` | class | Error: an argument does not match any parameter |
| `Runner` | interface | `run(request): Promise<Response>` contract |
| `Segment` | class | Group of classes and procedures |
| `Class` | class | Class with fqn and implementation |
| `Procedure` | class | Procedure with multiple versioned implementations |
| `Implementation` | class | Procedure implementation (version, access level, parameters, executable) |
| `Version` | class | Semantic version (major.minor.patch) with comparison methods |
| `NamedParameter` | class | Named (single-value) parameter |
| `ArrayParameter` | class | Destructured array parameter |
| `ObjectParameter` | class | Destructured object parameter |
| `Request` | class | Incoming request (fqn, version, args, headers, mode) |
| `Response` | class | Outgoing response (status, result, headers) |
| `ArgumentConstructor` | class | Extracts argument values based on parameter definitions |
| `ErrorConverter` | class | Converts errors to status codes and vice versa |
| `VersionParser` | class | Parses version strings into `Version` objects |
| `ExecutionManager` | class | Main orchestrator: implements `Runner`, manages segments, runs procedures |

Not exported (internal only): `Application`, `Parameter`, `DestructuredParameter`, `InvalidSegment`, `StartingExecutionManagerFailed`, `StoppingExecutionManagerFailed`.

## Dependencies

| Package | Usage |
| --- | --- |
| `@jitar/errors` | Base error types (`BadRequest`, `NotFound`, `ServerError`, etc.) used by package-specific errors and `ErrorConverter` |
| `@jitar/sourcing` | `ModuleImporter` interface used by `ExecutionManager` to dynamically import segment modules |

All intra-monorepo imports must use workspace aliases (`@jitar/...`), never relative paths across packages.

## Package structure

```
src/
├── definitions/                    ← Constants and type definitions
│   ├── AccessLevel.ts              ← Access level constants (PRIVATE, PROTECTED, PUBLIC) + AccessLevel type
│   ├── RunModes.ts                 ← Run mode constants (NORMAL, DRY) + RunMode type
│   └── StatusCodes.ts              ← HTTP-like status code constants (OK, BAD_REQUEST, SERVER_ERROR, etc.)
├── errors/                         ← Package-specific error classes
│   ├── ImplementationNotFound.ts
│   ├── InvalidParameterValue.ts
│   ├── InvalidSegment.ts
│   ├── InvalidVersionNumber.ts
│   ├── MissingParameterValue.ts
│   ├── ProcedureNotAccessible.ts
│   ├── ProcedureNotFound.ts
│   ├── StartingExecutionManagerFailed.ts
│   ├── StoppingExecutionManagerFailed.ts
│   └── UnknownParameter.ts
├── interfaces/                     ← Core interfaces
│   └── Runner.ts                   ← Runner interface with `run(request): Promise<Response>`
├── models/                         ← Domain model classes
│   ├── Application.ts              ← Aggregates segments; provides class/procedure lookup across all segments
│   ├── ArrayParameter.ts           ← Destructured array parameter — extends DestructuredParameter
│   ├── Class.ts                    ← Represents a class with fqn and implementation
│   ├── DestructuredParameter.ts    ← Destructured parameter with variables array
│   ├── Implementation.ts           ← Procedure implementation with version, access level, parameters, and executable
│   ├── NamedParameter.ts           ← Named (single-value) parameter — extends Parameter
│   ├── ObjectParameter.ts          ← Destructured object parameter — extends DestructuredParameter
│   ├── Parameter.ts                ← Base parameter class (name, isOptional)
│   ├── Procedure.ts                ← Procedure with multiple versioned implementations
│   ├── Request.ts                  ← Incoming request (fqn, version, args, headers, mode)
│   ├── Response.ts                 ← Outgoing response (status, result, headers)
│   ├── Segment.ts                  ← Segment containing classes and procedures
│   └── Version.ts                  ← Semantic version (major.minor.patch) with comparison methods
├── utils/                          ← Utility classes
│   ├── ArgumentConstructor.ts      ← Extracts argument values from Map<string, unknown> based on parameter definitions
│   ├── ErrorConverter.ts           ← Converts errors to status codes and vice versa
│   └── VersionParser.ts            ← Parses version strings into Version objects
├── ExecutionManager.ts             ← Main orchestrator: implements Runner, manages segments, runs procedures
└── index.ts                        ← Public API re-exports
```

## Architecture

### Overview

#### ExecutionManager

The `ExecutionManager` class is the primary entry point. It:
- Implements the `Runner` interface (`run(request): Promise<Response>`).
- Is constructed with a `ModuleImporter` and an optional list of segment filenames (`segmentFiles`).
- Manages a collection of `Segment` objects via an internal `Application`.
- Supports lifecycle methods: `start()` (loads all segment files), `stop()` (clears segments), `loadSegment(filename)`, `addSegment(segment)` (throws `InvalidSegment` if not a `Segment` instance).
- Provides introspection: `getClassNames()`, `hasClass()`, `getClass()`, `getClassByImplementation()`, `getProcedureNames()`, `hasProcedure()`, `getProcedure()`.
- Executes procedures by resolving the implementation, extracting arguments, and calling the executable (with the `Request` bound as `this`).

#### Segment

A `Segment` groups related `Class` and `Procedure` objects, identified by a string `id`. It:
- Stores classes and procedures in `Map<string, Class>` and `Map<string, Procedure>` respectively.
- Provides `addClass(clazz)` and `addProcedure(procedure)` methods that return `this` for method chaining.
- Exposes `getExposedProcedures()` which filters to only public and protected procedures.

#### Procedure

A `Procedure` represents a callable endpoint with multiple versioned `Implementation` objects. It:
- Stores implementations keyed by `Version` in a `Map<Version, Implementation>`.
- Tracks the latest (highest version) implementation automatically.
- Supports version fallback: `getImplementation(version)` returns the closest available version that is less than or equal to the requested version.

#### Implementation

An `Implementation` wraps a callable function with its metadata:
- `version`: Semantic version of this implementation.
- `access`: Access level (`private`, `protected`, `public`).
- `parameters`: Array of `Parameter` objects describing expected arguments.
- `executable`: The actual function to invoke.

#### Request / Response

- **Request**: Carries the procedure's fully qualified name (`fqn`), `Version`, arguments (`Map<string, unknown>`), headers (`Map<string, string>`), and run mode (`NORMAL` or `DRY`).
- **Response**: Carries an HTTP-like `status` code, a `result`, and optional `headers`.

#### Parameter Types

The package supports three parameter types:
1. **NamedParameter**: A single named value (mandatory or optional).
2. **ArrayParameter**: A destructured array with typed variables.
3. **ObjectParameter**: A destructured object with typed variables.

Both `ArrayParameter` and `ObjectParameter` extend `DestructuredParameter`, which holds an array of `Parameter` variables.

### Decisions

- **Execution errors vs. application errors**: The execution manager distinguishes between the two:
  - **Execution errors** are thrown and must be caught by the caller (e.g., `ProcedureNotFound`, `ImplementationNotFound`, `InvalidSegment`).
  - **Application errors** are not part of the execution process — they are caught internally by `ExecutionManager.#runImplementation()` and wrapped in a `Response` with the appropriate status code via `ErrorConverter`.
- **Version fallback**: A request for a version without an exact implementation falls back to the highest lower version (see [Version Resolution](#version-resolution)).
- **DRY run mode**: Arguments are still validated, but the procedure is not executed (see [DRY Run Mode](#dry-run-mode)).
- **Private package**: Not published to npm; only consumed by other Jitar packages.

## Coding Conventions

### Class Design
- Use `#` private field prefix for all class fields (e.g., `readonly #name: string;`).
- Use getters for public field access (e.g., `get name() { return this.#name; }`).
- Constructor-based initialization — no default values in property declarations.
- Builder methods that mutate state return `this` for method chaining.

### Naming Conventions
- **Classes**: PascalCase (e.g., `ExecutionManager`, `Segment`, `Procedure`).
- **Interfaces**: PascalCase, without prefix or suffix (e.g., `Runner`).
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

## Error Handling

See the execution vs. application error decision under [Decisions](#decisions).

### Package-Specific Error Pattern

All errors in this package:
1. Extend base error types from `@jitar/errors` (e.g., `ProcedureNotFound extends NotFound`).
2. Use the `#` private field prefix for error-specific data.
3. Set `this.name` to the class name in the constructor.
4. Provide getters for error-specific fields.
5. Export as `default` class.

Exceptions: the lifecycle errors `StartingExecutionManagerFailed` and `StoppingExecutionManagerFailed` extend the native `Error` and pass the underlying error as `{ cause }`; `InvalidSegment` extends `ServerError` without extra fields.

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

## Testing

### Test Structure

Tests follow the package's source code organization:

```
test/
├── ExecutionManager.spec.ts        # Integration tests for ExecutionManager
├── fixtures/                       # Shared test fixtures for top-level components
│   ├── executionManagers.fixture.ts
│   └── index.ts
├── models/                         # Model-specific tests
│   ├── Application.spec.ts
│   ├── Implementation.spec.ts
│   ├── Procedure.spec.ts
│   ├── Segment.spec.ts
│   ├── Version.spec.ts
│   └── fixtures/                   # Model-specific fixtures
│       ├── applications.fixture.ts
│       ├── executables.fixture.ts
│       ├── implementations.fixture.ts
│       ├── parameters.fixture.ts
│       ├── procedures.fixture.ts
│       ├── segments.fixture.ts
│       ├── versions.fixture.ts
│       └── index.ts
└── utils/                          # Utility-specific tests
    ├── ArgumentConstructor.spec.ts
    ├── VersionParser.spec.ts
    └── fixtures/                   # Utility-specific fixtures
        ├── arguments.fixture.ts
        ├── parameters.fixture.ts
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

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the package (outputs to `dist/`) |
| `npm run clean` | Remove `dist/` directory |
| `npm run test` | Run all tests |
| `npm run test-coverage` | Run tests with v8 coverage |
| `npm run lint` | Lint the package with ESLint |

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
