# Configuration Package Agent Guidelines

## Purpose
This package provides configuration loading, parsing, and validation for the Jitar runtime. It reads JSON configuration files, replaces environment variables, validates configurations against schemas, and exposes configuration types for runtime and service layers.

## Dependencies
- `@jitar/sourcing` — `FileManager` interface and `LocalFileManager` for file operations
- `@jitar/validation` — `Validator` class and `ValidationScheme` type for configuration validation
- `dotenv` — `.env` file loading

## Architecture

The package is organized into four logical modules, each with its own index file:

```
src/
├── index.ts                          # Main exports (types + ConfigurationManager)
├── ConfigurationManager.ts          # Orchestrator — composes all sub-components
├── environment/                      # .env file handling
│   ├── index.ts
│   └── Configurator.ts
├── runtime/                          # Runtime configuration (source, target, segments, resources, build)
│   ├── index.ts
│   ├── ConfigurationBuilder.ts
│   ├── definitions/RuntimeConfiguration.ts
│   └── errors/RuntimeConfigurationInvalid.ts
├── service/                          # Service configuration (url, http, gateway, proxy, repository, standalone, worker, remoteWorker)
│   ├── index.ts
│   ├── ConfigurationBuilder.ts
│   ├── definitions/                  # Each service type has its own definition file
│   │   ├── ServiceConfiguration.ts
│   │   ├── StandaloneConfiguration.ts
│   │   ├── GatewayConfiguration.ts
│   │   ├── WorkerConfiguration.ts
│   │   ├── RepositoryConfiguration.ts
│   │   ├── HttpConfiguration.ts
│   │   ├── ProxyConfiguration.ts
│   │   └── RemoteWorkerConfiguration.ts
│   └── errors/ServiceConfigurationInvalid.ts
└── utils/                            # Shared utility: JSON reading with env var interpolation
    ├── index.ts
    ├── ConfigurationReader.ts
    └── errors/InvalidConfigurationFile.ts
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

## Coding Conventions

### File Organization
- **1 file per logical component** (class, type, or error).
- Group related types and their validation schemes in the same file (e.g., `RuntimeConfiguration.ts`).
- Each sub-module (`runtime/`, `service/`, `utils/`, `environment/`) must have an `index.ts` that re-exports its public members.

### Exports
- **Classes and default types**: `export default` (e.g., `export default class ConfigurationBuilder`).
- **Named exports for shared values**: `const DefaultValues`, `validationScheme` are exported via `export { ... }`.
- **Index files**: Re-export from sub-modules using `export { default as <Name> }` pattern.
- **Do not export types/functions** unless shared across multiple components.

### Class Patterns
- Private fields use `#` prefix (e.g., `#fileManager`, `#reader`, `#validator`).
- Constructor always assigns dependencies to private fields.
- Builder classes receive dependencies via constructor injection (`ConfigurationReader`, `Validator`).
- Error classes extend `Error` and take descriptive arguments in the constructor.

### Validation Patterns
- Each configuration type exports a `validationScheme: ValidationScheme` constant.
- Schemes use `as const` assertions.
- Supported types: `'string'`, `'url'`, `'integer'`, `'boolean'`, `'list'` (with `items`), `'group'` (with nested `fields`).
- Fields declare `required: boolean`.
- Configuration builders validate input against the scheme and throw a typed error if `validation.valid === false`.

### Default Values
- Default values are defined as a `const DefaultValues` object and exported.
- Builders apply defaults using the nullish coalescing operator (`??=`) after reading.
- The `meta` field (containing `root` and `configFile`) is always set by the builder, never from the file.

### Error Messages
- Error constructors receive the `filename` and `ValidationResult`.
- Error messages join `validation.errors` with a separator (e.g., `'\\n'` or `'\\n => '`).
- Message format: `Invalid <type> configuration '<filename>'<separator><errors>`.

## Testing Conventions

### Test Structure
- Tests live in `test/` mirroring the `src/` directory structure.
- Each test file is named `<ComponentName>.spec.ts`.
- Per-test-file fixtures live in `test/<module>/fixtures/`.

### Fixture Patterns
- **File manager fixture** (`TestFileManager` in `test/fixtures/fileManager.fixture.ts`): Implements the `FileManager` interface, stores a `Record<string, File>` mapping filenames to file objects.
- **Configuration fixtures**: Define `FILENAMES` constants and `CONFIGURATIONS` result objects.
- **Builder fixtures**: Instantiate the builder with mocked dependencies.

### Test Patterns
- Use `vitest` with `describe`, `it`, `expect`.
- Environment variable tests use `vi.stubEnv()` / `vi.unstubAllEnvs()`.
- Error cases use `await expect(promise).rejects.toEqual(new <ErrorClass>(...))`.
- Success cases use `await expect(promise).resolves.toEqual(<expectedConfiguration>)`.

## Key Implementation Details

### Environment Variable Interpolation
- Pattern: `${VAR_NAME}` (e.g., `${TARGET}`).
- Missing env vars resolve to the string `'null'` (not `null`).

### Default Configuration Values
- Runtime defaults: `source: './src'`, `target: './dist'`, `segments: './segments'`, `resources: './resources'`, `build.ignore: []`.
- Runtime default filename: `'./jitar.json'`.

### Service Configuration
- `ServiceConfiguration` is a discriminated union type — exactly one of `gateway`, `proxy`, `repository`, `standalone`, `worker`, or `remoteWorker` should be present.
- Each sub-type has its own validation scheme, composed into the parent scheme via `fields`.

### ConfigurationReader
- Returns `{}` (empty object) when the file does not exist — this allows builders to apply all defaults.
- Throws `InvalidConfigurationFile` if the file exists but is not JSON (checked via `file.type.includes('json')`).

## Workflow

When working with this package:

1. **Read the source**: Understand the component's role within its sub-module.
2. **Follow naming conventions**: Class names PascalCase, `#` for private, `camelCase` for methods.
3. **Use workspace aliases**: Import from `@jitar/sourcing` and `@jitar/validation`, never relative paths.
4. **Export through index files**: Every public type/class/error must be re-exported via its module's `index.ts`.
5. **Write tests**: Mirror the source structure, create fixtures for dependencies, test both success and error paths.
6. **Run `npm run lint`** after making changes.
7. **Run `npm run test`** to verify all tests pass.