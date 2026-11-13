# Configuration Package

## Package Overview

This package (`@jitar/configuration`) provides configuration loading, parsing, and validation for the Jitar runtime. It reads JSON configuration files, replaces environment variables with their values, validates configurations against schemas, and exposes configuration types for runtime and service layers.

It is a **private** package within the Jitar monorepo and is not published independently.

## Architecture

The package is organized into four logical modules:

```
src/
├── index.ts                          # Main exports (types + ConfigurationManager)
├── ConfigurationManager.ts          # Orchestrator — composes all sub-components
├── environment/                      # .env file handling
├── runtime/                          # Runtime configuration (source, target, segments, resources, build)
├── service/                          # Service configuration (url, http, gateway, proxy, repository, standalone, worker, remoteWorker)
└── utils/                            # Shared utility: JSON reading with env var interpolation
```

### Component Responsibilities

| Component | Responsibility |
|---|---|
| `ConfigurationManager` | Public facade — composes `EnvironmentConfigurator`, `RuntimeConfigurationBuilder`, and `ServiceConfigurationBuilder` |
| `EnvironmentConfigurator` | Loads `.env` files via `dotenv` |
| `ConfigurationReader` | Reads JSON files, replaces `${VAR}` patterns with `process.env` values, throws `InvalidConfigurationFile` for non-JSON |
| `RuntimeConfigurationBuilder` | Builds `RuntimeConfiguration` with defaults, adds `meta` (root, configFile) |
| `ServiceConfigurationBuilder` | Builds `ServiceConfiguration` with sub-type discriminated unions, adds `meta` |
| `RuntimeConfiguration` | Type + validation scheme for build-time configuration |
| `ServiceConfiguration` | Type + validation scheme for runtime service configuration (aggregates all sub-types) |

### Key Data Flow

1. `ConfigurationManager` is instantiated with an optional `rootPath` (defaults to `'./'`).
2. It composes an `EnvironmentConfigurator`, `RuntimeConfigurationBuilder`, and `ServiceConfigurationBuilder`.
3. `configureEnvironment()` loads `.env` files (via `dotenv`).
4. `getRuntimeConfiguration()` / `getServiceConfiguration()` delegate to their respective builders.
5. Each builder uses a `ConfigurationReader` (which reads JSON, interpolates env vars) and a `Validator` (from `@jitar/validation`).
6. Validation failures throw package-specific error classes (`RuntimeConfigurationInvalid`, `ServiceConfigurationInvalid`).

## Dependencies

- `@jitar/sourcing` — `FileManager` interface and `LocalFileManager` for file operations.
- `@jitar/validation` — `Validator` class and `ValidationScheme` type for configuration validation.
- `dotenv` (v18.0.9) — `.env` file loading.

All intra-monorepo dependencies use workspace aliases (`@jitar/...`). Never use relative paths across `packages/`.

## Development Conventions

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

### Validation Schemes

Each configuration type exports a `validationScheme` (of type `ValidationScheme` from `@jitar/validation`). Supported scheme types include: `string`, `url`, `integer`, `boolean`, `list` (with optional `items`), and `group` (with nested `fields`). All fields are optional unless explicitly marked `required: true`.

### Error Classes

- `RuntimeConfigurationInvalid` — thrown when runtime configuration fails validation. Message format: `Invalid runtime configuration '<filename>'\n<error messages joined by '\n'>`.
- `ServiceConfigurationInvalid` — thrown when service configuration fails validation. Message format: `Invalid server configuration '<filename>'\n => <error messages joined by '\n => '>`.
- `InvalidConfigurationFile` — thrown when a configuration file exists but is not JSON (checked via `file.type.includes('json')`).

## Public API and Compatibility

The package exports the following at its entry point (`dist/index.js`):

**Types:**
- `RuntimeConfiguration` — build-time configuration (source, target, segments, resources, build).
- `ServiceConfiguration` — runtime service configuration with sub-types (url, http, gateway, proxy, repository, standalone, worker, remoteWorker).
- `StandaloneConfiguration`, `ProxyConfiguration`, `WorkerConfiguration`, `GatewayConfiguration`, `RepositoryConfiguration`, `HttpConfiguration` — service sub-type definitions.

**Classes:**
- `ConfigurationManager` — public facade for all configuration operations.

The `ConfigurationManager` exposes three methods:
- `configureEnvironment(filename?: string)` — loads `.env` files (default: `.env`).
- `getRuntimeConfiguration(filename?: string)` — builds runtime configuration (default filename: `'./jitar.json'`).
- `getServiceConfiguration(filename: string)` — builds service configuration.

## Testing

- **Framework**: `vitest` (configured via `vitest.config.ts`).
- **Coverage**: `v8` provider.
- **Commands**: `npm run test` (run tests), `npm run test-coverage` (run with coverage).
- **Test files**: Named `<ComponentName>.spec.ts`, placed in `test/<module>/`.
- **Fixtures**: Organized in `test/<module>/fixtures/` mirroring source structure.
- **Patterns**:
  - Use `vi.stubEnv()` / `vi.unstubAllEnvs()` for environment variable tests.
  - Use `await expect(promise).resolves.toEqual(...)` for success cases.
  - Use `await expect(promise).rejects.toEqual(new <ErrorClass>(...))` for error cases.
  - Implement `TestFileManager` in fixtures to mock the `FileManager` interface.

## Build and Validation

- `npm run build` — compiles TypeScript (`tsc -p tsconfig.json`).
- `npm run clean` — removes `dist/` directory (`shx rm -rf dist`).
- `npm run lint` — runs ESLint (configured at monorepo root).
- `npm run test` — runs all tests via `vitest`.

TypeScript extends the root `tsconfig.json` with `rootDir: ./src` and `outDir: ./dist`. Test files and `vite.config.ts` are excluded from compilation.

## Constraints and Important Considerations

- **Private package**: This package is not published. It is consumed only by other packages within the monorepo.
- **Environment variable interpolation**: Missing env vars resolve to the string `'null'` (not `null`). This is a known behavior — document it when adding env var usage.
- **ConfigurationReader returns `{}` for non-existing files**: This allows builders to apply all defaults when no configuration file is present.
- **ConfigurationReader throws `InvalidConfigurationFile` for non-JSON files**: Only `.json` files are accepted.
- **Do not export types/functions** unless they need to be shared across components.
- **Never use `null`** — use `undefined` unless an external library requires it.
- **Do not disable ESLint rules** with inline comments without explicit approval.
- **Always run `npm run lint`** after modifying TypeScript files.
- **Always run `npm run test`** to verify all tests pass before considering changes complete.

## Available Skills

The package has the following skills available in `.agents/skills/` (both currently disabled):

- **`code-review`** — Use when reviewing a pull request or diff. Checks formatting, correctness, package-specific conventions, tests, and security. (See `.agents/skills/code-review/SKILL.md`)
- **`implementation`** — Use when implementing or modifying configuration-related code. Covers architecture, conventions, testing, and key implementation details. (See `.agents/skills/implementation/SKILL.md`)

Consult these skills when performing code reviews or implementing configuration changes.