# @jitar/health

This file extends the root [`AGENTS.md`](../../AGENTS.md) with information specific to the health package.

## Purpose

This package provides the service health system for the Jitar runtime. It manages the lifecycle of health monitoring, dynamically loads and executes health checks using `@jitar/sourcing`, evaluates overall and individual system health with timeout capabilities, and tracks health manager operational states.

## Exports

The package exports the following core classes, interfaces, and definitions from `src/index.ts`:

| Exported Symbol | Type | Description |
|-----------------|------|-------------|
| `HealthManager` | class | Manages health checks lifecycle, loading, and evaluation |
| `HealthCheck` | interface | Interface defining individual health check requirements |
| `States` | object | Lifecycle state constants (`STARTING`, `STARTED`, `STOPPING`, `STOPPED`) |
| `State` | type | Type alias for a valid state string (`starting`, `started`, `stopping`, `stopped`) |

## Dependencies

| Package | Usage |
| --- | --- |
| `@jitar/errors` | `ServerError` (base class of `InvalidHealthCheck`) |
| `@jitar/sourcing` | `ModuleImporter` (type) for dynamically importing health check modules |

## Package structure

```
src/
├── HealthManager.ts                    ← Core controller: lifecycle, loading, and execution of health checks
├── index.ts                            ← Re-exports States, State, HealthCheck, HealthManager
├── definitions/
│   └── States.ts                       ← Lifecycle state constants and State type
├── errors/
│   ├── InvalidHealthCheck.ts           ← Health check without isHealthy
│   ├── StartingHealthManagerFailed.ts  ← Wraps startup failure cause
│   └── StoppingHealthManagerFailed.ts  ← Wraps shutdown failure cause
└── interfaces/
    └── HealthCheck.ts                  ← Health check contract
```

## Architecture

### Overview

- **`HealthManager` (`src/HealthManager.ts`)**: Core controller that manages startup, shutdown, dynamic health check module loading via `ModuleImporter`, registration, and execution of health checks with timeout enforcement.
  - Constructed with a `ModuleImporter` and an optional list of health check files.
  - `start()` (only from `stopped`): moves to `starting`, loads all configured health check files (default export of each module), then `started`. On failure it reverts to `stopped` and throws `StartingHealthManagerFailed`.
  - `stop()` (only from `started`): moves to `stopping`, clears all health checks, then `stopped`. On failure it reverts to `started` and throws `StoppingHealthManagerFailed`.
  - `loadHealthCheck(filename)`, `addHealthCheck(healthCheck)`, `clearHealthChecks()`: manage registered checks (keyed by `name`).
  - `isHealthy()`: runs all checks in parallel; `true` only when all pass, `false` if any fails or throws.
  - `getHealth()`: returns a `Map<string, boolean>` with the result per check; a throwing check is reported as `false`.
- **`HealthCheck` (`src/interfaces/HealthCheck.ts`)**: Interface specifying:
  - `name`: string identifier for the health check.
  - `timeout`: optional number (milliseconds) before timing out.
  - `isHealthy()`: async function returning `Promise<boolean>`.
- **`States` (`src/definitions/States.ts`)**: State definitions (`STARTING`, `STARTED`, `STOPPING`, `STOPPED`).
- **Errors (`src/errors/`)**:
  - `InvalidHealthCheck`: Extends `ServerError` (from `@jitar/errors`) when a health check is invalid (missing `isHealthy`).
  - `StartingHealthManagerFailed`: Extends native `Error` wrapping startup failure cause.
  - `StoppingHealthManagerFailed`: Extends native `Error` wrapping shutdown failure cause.

### Decisions

- **Timeout via `Promise.race`**: When a check defines a `timeout`, it races against a timer that resolves to `false`, so slow checks count as unhealthy.
- **Failures are unhealthy, not errors**: Throwing health checks never propagate from `isHealthy()` / `getHealth()`; they result in `false`.
- **Idempotent lifecycle**: `start()` and `stop()` return silently when not in the expected state, and roll back the state on failure.

## Coding Conventions

- **Class naming**: PascalCase (`HealthManager`, `InvalidHealthCheck`, etc.).
- **Exports**: `export default class` / `export default interface` / `export default` objects.
- **Dependencies**: Relies on `@jitar/errors` and `@jitar/sourcing`.
- **Formatting**: Semicolons required, Allman brace style, newline at end of file.

## Testing

- Unit tests are located in `test/HealthManager.spec.ts`.
- Fixtures and mock health checks are located in `test/fixtures/`.

## Commands

| Command | Script | Description |
|---------|--------|-------------|
| `npm run build` | `tsc -p tsconfig.json` | Compile TypeScript source to `./dist` |
| `npm run test` | `vitest run` | Run unit tests with Vitest |
| `npm run test-coverage` | `vitest run --coverage` | Run test suite with code coverage |
| `npm run lint` | `eslint` | Lint source files |
| `npm run clean` | `shx rm -rf dist` | Remove build artifacts |

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
