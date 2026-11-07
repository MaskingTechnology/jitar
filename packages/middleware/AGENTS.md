# @jitar/middleware — Package Guidelines

## Overview

This package provides middleware support for the Jitar runtime. It manages a chain of middleware components that process requests in sequence, passing them through a handler chain until a final response is produced.

## Architecture

The middleware system follows the classic middleware chain pattern:

```
Request -> [Middleware1] -> [Middleware2] -> [Middleware3] -> Default Response
```

Each middleware can inspect or modify the request before calling `next()`, and inspect or modify the response after `next()` returns.

## Exports

Six items are exported from `src/index.ts`:

| Exported Symbol       | Type      | Description                                        |
|-----------------------|-----------|----------------------------------------------------|
| `States`              | class     | Object defining the four lifecycle state constants |
| `State`               | type      | Type alias for a valid state string                |
| `Middleware`          | interface | Interface that all middleware must implement       |
| `NextHandler`         | type      | Type alias for the next handler function           |
| `MiddlewareManager`   | class     | Manages loading, lifecycle, and execution of middleware |

## Core Components

### Middleware Interface

Every middleware must implement this interface:

```typescript
interface Middleware
{
    handle(request: Request, next: NextHandler): Promise<Response>;
}
```

The `handle` method receives the current `Request` and a `NextHandler` function. Calling `next()` passes control to the next middleware in the chain. If there is no next middleware, the chain falls through to a default `Response(StatusCodes.OK)`.

### NextHandler Type

```typescript
type NextHandler = () => Promise<Response>;
```

A function that, when called, executes the next middleware in the chain (or returns a default response if none exists).

### States Definition

The middleware manager tracks four lifecycle states:

```typescript
const States =
{
    STARTING: 'starting',
    STARTED: 'started',
    STOPPING: 'stopping',
    STOPPED: 'stopped'
} as const;
```

### MiddlewareManager Class

The `MiddlewareManager` is the central orchestrator. It provides:

| Method                  | Description                                                        |
|-------------------------|--------------------------------------------------------------------|
| `start()`               | Loads all middleware files and transitions to `STARTED` state      |
| `stop()`                | Clears all middleware and transitions to `STOPPED` state           |
| `loadMiddleware(filename)` | Loads and adds a single middleware from a file path               |
| `addMiddleware(middleware)` | Adds a middleware instance directly (validates `handle` exists)  |
| `getMiddleware(type)`   | Retrieves a middleware by its class type                           |
| `clearMiddlewares()`    | Removes all middleware from the chain                              |
| `handle(request)`       | Executes the middleware chain and returns a `Promise<Response>`    |
| `state` (getter)        | Returns the current lifecycle state                                |

The manager accepts a `ModuleImporter` and optional list of middleware file paths in its constructor. Middleware are executed in the order they are added.

## Error Classes

Three error classes are defined in `src/errors/`:

| Error Class                    | Base Class  | Default Message                       |
|--------------------------------|-------------|---------------------------------------|
| `InvalidMiddleware`            | `ServerError` | "Invalid middleware"                |
| `StartingMiddlewareManagerFailed` | `Error`   | "Starting middleware manager failed"  |
| `StoppingMiddlewareManagerFailed` | `Error`   | "Stopping middleware manager failed"  |

### Error Class Pattern

**Package-specific errors** (`StartingMiddlewareManagerFailed`, `StoppingMiddlewareManagerFailed`) extend `Error` directly:

```typescript
export default class <Name> extends Error
{
    constructor(cause: unknown)
    {
        super('Error message', { cause });
    }
}
```

**Validation errors** (`InvalidMiddleware`) extend the appropriate base error from `@jitar/errors`:

```typescript
import { ServerError } from '@jitar/errors';

export default class InvalidMiddleware extends ServerError
{
    constructor()
    {
        super('Invalid middleware');
    }
}
```

### Rules

- **Class name**: PascalCase, matching the file name exactly.
- **Export**: `export default class`, never named exports.
- **File structure**: One class per file, no trailing whitespace beyond the closing brace and newline.
- **Package-specific errors** (lifecycle failures): Extend `Error` directly, accept a `cause: unknown` parameter.
- **Validation errors** (input/usage issues): Extend the appropriate base error from `@jitar/errors` (e.g., `ServerError`).
- **Validation errors** (input/usage issues): Extend the appropriate base error from `@jitar/errors` (e.g., `ServerError`).

## Index Exports

`src/index.ts` re-exports all symbols using the `default as <Name>` pattern:

```typescript
export { default as States, type State } from './definitions/States';
export { default as Middleware } from './interfaces/Middleware';
export { default as NextHandler } from './types/NextHandler';
export { default as MiddlewareManager } from './MiddlewareManager';
```

Do not change the export order or naming convention in `index.ts`.

## File Structure

```
src/
├── index.ts                          # Public API exports
├── MiddlewareManager.ts              # Core manager class
├── definitions/
│   └── States.ts                     # Lifecycle state constants
├── errors/
│   ├── InvalidMiddleware.ts          # Validation error
│   ├── StartingMiddlewareManagerFailed.ts  # Lifecycle error
│   └── StoppingMiddlewareManagerFailed.ts  # Lifecycle error
├── interfaces/
│   └── Middleware.ts                 # Middleware interface
└── types/
    └── NextHandler.ts                # NextHandler type alias
```

## Testing

Tests are located under `test/` and use Vitest. Fixtures are organized under `test/fixtures/`:

| Fixture File                    | Description                                         |
|---------------------------------|-----------------------------------------------------|
| `middlewares.fixture.ts`        | Defines example middleware classes (First, Second, Third) |
| `middlewareManagers.fixture.ts` | Creates pre-configured `MiddlewareManager` instances  |
| `index.ts`                      | Re-exports all fixtures                              |

### Test Patterns

- Use `describe` / `it` blocks with nested `describe` for method-level grouping.
- Create fixture middleware that demonstrates the middleware chain behavior.
- Each middleware should modify the request (via `request.setHeader`) and/or the response (via `response.result`).
- The final middleware in a chain returns a new `Response(StatusCodes.OK, result)`.
- Assertions verify that all middleware executed in order (check headers and response result).

## Build Commands

| Script             | Command                    | Description              |
|--------------------|----------------------------|--------------------------|
| test               | `vitest run`               | Run tests                |
| test-coverage      | `vitest run --coverage`    | Run tests with coverage  |
| lint               | `eslint`                   | Lint source files        |
| build              | `tsc -p tsconfig.json`     | Compile to `./dist`      |
| clean              | `shx rm -rf dist`          | Remove build artifacts   |

## Configuration

- Extends root `tsconfig.json` with `rootDir: ./src` and `outDir: ./dist`.
- Package is `private: true` — it is not published independently.
- TypeScript target: `esnext`, module: `esnext`, moduleResolution: `bundler`.
- Test coverage uses the `v8` provider via `vitest.config.ts`.

## Dependencies

- `@jitar/errors` — Base error classes (`ServerError`, etc.).
- `@jitar/execution` — Core execution types (`Request`, `Response`, `StatusCodes`, `RunModes`, `Version`).
- `@jitar/sourcing` — `ModuleImporter` interface for dynamically loading middleware modules.

## Adding a New Middleware

1. Create a class that implements the `Middleware` interface.
2. Implement the `handle(request: Request, next: NextHandler): Promise<Response>` method.
3. Before calling `next()`, inspect or modify the request as needed.
4. After `next()` returns, inspect or modify the response as needed.
5. Return the response.

## Adding a New Error

1. Create a new file under `src/errors/<Name>.ts`.
2. Follow the appropriate error class pattern:
   - **Lifecycle errors** (manager start/stop failures): Extend `Error` directly, accept `cause: unknown`.
   - **Validation errors** (invalid input): Extend the appropriate base error from `@jitar/errors`.
3. Ensure the file has no trailing whitespace beyond the closing brace and a single newline.

## Adding a New State

1. Add the new state constant to `src/definitions/States.ts`.
2. Update any state transition logic in `MiddlewareManager` to handle the new state.
3. Ensure state guards in `start()` and `stop()` account for the new state.
