# @jitar/health — Package Guidelines

## Overview

This package provides the service health system for the Jitar runtime. It manages the lifecycle of health monitoring, dynamically loads and executes health checks using `@jitar/sourcing`, evaluates overall and individual system health with timeout capabilities, and tracks health manager operational states.

## Exports

The package exports the following core classes, interfaces, and definitions from `src/index.ts`:

| Export | Type | Description |
|--------|------|-------------|
| `HealthManager` | Class | Manages health checks lifecycle, loading, and evaluation |
| `HealthCheck` | Interface | Interface defining individual health check requirements |
| `States` (`State`) | Object / Type | Lifecycle states (`starting`, `started`, `stopping`, `stopped`) |

## Core Components & Structure

- **`HealthManager` (`src/HealthManager.ts`)**: Core controller that manages startup, shutdown, dynamic health check module loading via `ModuleImporter`, registration, and execution of health checks with timeout enforcement.
- **`HealthCheck` (`src/interfaces/HealthCheck.ts`)**: Interface specifying:
  - `name`: string identifier for the health check.
  - `timeout`: optional number (milliseconds) before timing out.
  - `isHealthy()`: async function returning `Promise<boolean>`.
- **`States` (`src/definitions/States.ts`)**: State definitions (`STARTING`, `STARTED`, `STOPPING`, `STOPPED`).
- **Errors (`src/errors/`)**:
  - `InvalidHealthCheck`: Extends `ServerError` (from `@jitar/errors`) when a health check is invalid (missing `isHealthy`).
  - `StartingHealthManagerFailed`: Extends native `Error` wrapping startup failure cause.
  - `StoppingHealthManagerFailed`: Extends native `Error` wrapping shutdown failure cause.

## Coding Standards & Conventions

- **Class naming**: PascalCase (`HealthManager`, `InvalidHealthCheck`, etc.).
- **Exports**: `export default class` / `export default interface` / `export default` objects.
- **Dependencies**: Relies on `@jitar/errors` and `@jitar/sourcing`.
- **Formatting**: Semicolons required, Allman brace style, newline at end of file.

## Build & Test Commands

| Script | Command | Description |
|--------|---------|-------------|
| build | `tsc -p tsconfig.json` | Compile TypeScript source to `./dist` |
| test | `vitest run` | Run unit tests with Vitest |
| test-coverage | `vitest run --coverage` | Run test suite with code coverage |
| lint | `eslint` | Lint source files |
| clean | `shx rm -rf dist` | Remove build artifacts |

## Testing

- Unit tests are located in `test/HealthManager.spec.ts`.
- Fixtures and mock health checks are located in `test/fixtures/`.
