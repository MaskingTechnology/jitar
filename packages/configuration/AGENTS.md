# @jitar/configuration

This file extends the root [`AGENTS.md`](../../AGENTS.md) with information specific to the configuration package.

## Purpose

This package provides configuration loading, parsing, and validation for the Jitar runtime. It reads JSON configuration files, replaces environment variables with their values, validates configurations against schemas, and exposes configuration types for runtime and service layers.

It is a **private** package within the Jitar monorepo and is not published independently.

## Exports

The package exports the following at its entry point (`dist/index.js`):

| Exported Symbol | Type | Description |
| --- | --- | --- |
| `ConfigurationManager` | class | Public facade for all configuration operations |
| `RuntimeConfiguration` | type | Build-time configuration (source, target, segments, resources, build) |
| `ServiceConfiguration` | type | Runtime service configuration (url, setUp, tearDown, middleware, healthChecks, http, gateway, proxy, repository, standalone, worker, remoteWorker) |
| `StandaloneConfiguration` | type | Standalone service sub-type definition |
| `ProxyConfiguration` | type | Proxy service sub-type definition |
| `WorkerConfiguration` | type | Worker service sub-type definition |
| `GatewayConfiguration` | type | Gateway service sub-type definition |
| `RepositoryConfiguration` | type | Repository service sub-type definition |
| `HttpConfiguration` | type | HTTP service sub-type definition |

`RemoteWorkerConfiguration` is part of `ServiceConfiguration` (and exported from `service/index.ts`) but is not re-exported from the package entry point.

The `ConfigurationManager` exposes three methods:

- `configureEnvironment(filename?: string)` — loads `.env` files (default: `.env`).
- `getRuntimeConfiguration(filename?: string)` — builds runtime configuration (default filename: `'./jitar.json'`).
- `getServiceConfiguration(filename: string)` — builds service configuration.

## Dependencies

| Package | Usage |
| --- | --- |
| `@jitar/sourcing` | `FileManager` interface and `LocalFileManager` for file operations |
| `@jitar/validation` | `Validator` class and `ValidationScheme` / `ValidationResult` types for configuration validation |
| `dotenv` | `.env` file loading |

All intra-monorepo dependencies use workspace aliases (`@jitar/...`). Never use relative paths across `packages/`.

## Package structure

The package is organized into four logical modules:

```
src/
├── index.ts                          ← Main exports (types + ConfigurationManager)
├── ConfigurationManager.ts           ← Orchestrator — composes all sub-components
├── environment/                      ← .env file handling
│   └── Configurator.ts               ← EnvironmentConfigurator (dotenv)
├── runtime/                          ← Runtime configuration (source, target, segments, resources, build)
│   ├── ConfigurationBuilder.ts       ← RuntimeConfigurationBuilder
│   ├── definitions/                  ← RuntimeConfiguration type, DefaultValues, validationScheme
│   └── errors/                       ← RuntimeConfigurationInvalid
├── service/                          ← Service configuration (url, http, gateway, proxy, repository, standalone, worker, remoteWorker)
│   ├── ConfigurationBuilder.ts       ← ServiceConfigurationBuilder
│   ├── definitions/                  ← ServiceConfiguration + sub-type definitions and validation schemes
│   └── errors/                       ← ServiceConfigurationInvalid
└── utils/                            ← Shared utility: JSON reading with env var interpolation
    ├── ConfigurationReader.ts        ← Reads JSON, replaces ${VAR} patterns
    └── errors/                       ← InvalidConfigurationFile
```

## Architecture

### Overview

#### Component Responsibilities

| Component | Responsibility |
|---|---|
| `ConfigurationManager` | Public facade — composes `EnvironmentConfigurator`, `RuntimeConfigurationBuilder`, and `ServiceConfigurationBuilder` |
| `EnvironmentConfigurator` | Loads `.env` files via `dotenv` |
| `ConfigurationReader` | Reads JSON files, replaces `${VAR}` patterns with `process.env` values, throws `InvalidConfigurationFile` for non-JSON |
| `RuntimeConfigurationBuilder` | Builds `RuntimeConfiguration` with defaults, adds `meta` (root, configFile) |
| `ServiceConfigurationBuilder` | Builds `ServiceConfiguration` with sub-type discriminated unions, adds `meta` |
| `RuntimeConfiguration` | Type + validation scheme for build-time configuration |
| `ServiceConfiguration` | Type + validation scheme for runtime service configuration (aggregates all sub-types) |

#### Key Data Flow

1. `ConfigurationManager` is instantiated with an optional `rootPath` (defaults to `'./'`).
2. It creates a `LocalFileManager` for the root path, a shared `ConfigurationReader` and a shared `Validator`, and composes an `EnvironmentConfigurator`, `RuntimeConfigurationBuilder`, and `ServiceConfigurationBuilder` with them.
3. `configureEnvironment()` loads `.env` files (via `dotenv`), resolving the path through the file manager.
4. `getRuntimeConfiguration()` / `getServiceConfiguration()` delegate to their respective builders.
5. Each builder uses a `ConfigurationReader` (which reads JSON, interpolates env vars) and a `Validator` (from `@jitar/validation`).
6. Validation failures throw package-specific error classes (`RuntimeConfigurationInvalid`, `ServiceConfigurationInvalid`).

#### Validation Schemes

Each configuration type exports a `validationScheme` (of type `ValidationScheme` from `@jitar/validation`). Supported scheme types include: `string`, `url`, `integer`, `boolean`, `list` (with optional `items`), and `group` (with nested `fields`). All fields are optional unless explicitly marked `required: true`.

### Decisions

- **Private package**: This package is not published. It is consumed only by other packages within the monorepo.
- **Environment variable interpolation**: Missing env vars resolve to the string `'null'` (not `null`). This is a known behavior — document it when adding env var usage.
- **ConfigurationReader returns `{}` for non-existing files**: This allows builders to apply all defaults when no configuration file is present.
- **ConfigurationReader throws `InvalidConfigurationFile` for non-JSON files**: Only `.json` files are accepted.

## Coding Conventions

Follow the monorepo-wide conventions documented in the root [`CODING_STANDARDS.md`](../../CODING_STANDARDS.md) and the root [`AGENTS.md`](../../AGENTS.md).

Package-specific conventions:

- **1 file per logical component** (class, type, or error).
- **Group related types and their validation schemes** in the same file (e.g., `RuntimeConfiguration.ts` contains the type definition, `DefaultValues`, and `validationScheme`).
- **Classes and default types**: `export default` (e.g., `export default class ConfigurationBuilder`).
- **Named exports for shared values**: `const DefaultValues`, `validationScheme` are exported via `export { ... }`.
- **Index files**: Re-export from sub-modules using `export { default as <Name> }` pattern.
- **Private fields**: Use JavaScript private syntax (`#fieldName`).
- **Import ordering**: External dependencies first, then core (workspace) dependencies, then runtime dependencies, then types.
- **Imports within the package**: Use relative paths. Imports across packages: use workspace aliases (`@jitar/...`).
- **Every sub-module** (`runtime/`, `service/`, `utils/`, `environment/`) must have an `index.ts` that re-exports all public members.
- **Do not export types/functions** unless they need to be shared across components.
- **Never use `null`** — use `undefined` unless an external library requires it.
- **Do not disable ESLint rules** with inline comments without explicit approval.
- **Always run `npm run lint`** after modifying TypeScript files.
- **Always run `npm run test`** to verify all tests pass before considering changes complete.

## Error Classes

- `RuntimeConfigurationInvalid` — thrown when runtime configuration fails validation. Message format: `Invalid runtime configuration '<filename>'\n<error messages joined by '\n'>`.
- `ServiceConfigurationInvalid` — thrown when service configuration fails validation. Message format: `Invalid server configuration '<filename>'\n => <error messages joined by '\n => '>`.
- `InvalidConfigurationFile` — thrown when a configuration file exists but is not JSON (checked via `file.type.includes('json')`). Message format: `<filename> is not a valid configuration file.`

## Testing

- **Framework**: `vitest` (configured via `vitest.config.ts`).
- **Coverage**: `v8` provider.
- **Commands**: `npm run test` (run tests), `npm run test-coverage` (run with coverage).
- **Test files**: Named `<ComponentName>.spec.ts`, placed in `test/<module>/` (service configuration tests live in `test/server/`).
- **Fixtures**: Organized in `test/<module>/fixtures/` mirroring source structure.
- **Patterns**:
  - Use `vi.stubEnv()` / `vi.unstubAllEnvs()` for environment variable tests.
  - Use `await expect(promise).resolves.toEqual(...)` for success cases.
  - Use `await expect(promise).rejects.toEqual(new <ErrorClass>(...))` for error cases.
  - Implement `TestFileManager` in fixtures to mock the `FileManager` interface.

## Build and Validation

TypeScript extends the root `tsconfig.json` with `rootDir: ./src` and `outDir: ./dist`. Test files and `vite.config.ts` are excluded from compilation.

## Commands

| Command | Description |
| --- | --- |
| `npm run build` | Compile TypeScript (`tsc -p tsconfig.json`) |
| `npm run clean` | Remove `dist/` directory (`shx rm -rf dist`) |
| `npm run lint` | Run ESLint (configured at monorepo root) |
| `npm run test` | Run all tests via `vitest` |
| `npm run test-coverage` | Run tests with coverage report (`vitest run --coverage`) |

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
