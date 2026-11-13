---
name: implementation
description: Guides AI coding agents when implementing new features, modifying existing functionality, or refactoring code in the @jitar/configuration package. Covers architecture, conventions, testing, and validation procedures.
---

# Configuration Package Implementation Skill

## Purpose

This skill guides AI coding agents when implementing new features, modifying existing functionality, or refactoring code in the `@jitar/configuration` package. It covers the established architecture, implementation patterns, testing conventions, and validation procedures specific to this package.

Before starting any implementation, read this skill in full and cross-reference the package [`AGENTS.md`](../../../AGENTS.md) and the root [`AGENTS.md`](../../../../../AGENTS.md) for global conventions.

---

## 1. Understanding the Task

### Identifying the Affected Functionality

Configuration changes fall into one of these categories:

| Category | Affected Module | Key Files |
|---|---|---|
| Add a runtime configuration field | `runtime/` | `definitions/RuntimeConfiguration.ts`, `ConfigurationBuilder.ts` |
| Add a service configuration field or sub-type | `service/definitions/` | The relevant `*Configuration.ts` file, `ServiceConfiguration.ts` |
| Modify configuration validation rules | Any `definitions/` file | The `validationScheme` export in that file |
| Change default values | Any `definitions/` file | The `DefaultValues` export |
| Modify file reading behavior | `utils/` | `ConfigurationReader.ts` |
| Modify `.env` loading | `environment/` | `Configurator.ts` |
| Add a new service sub-type | `service/definitions/` | A new `*Configuration.ts`, update `ServiceConfiguration.ts` |
| Modify the public API | `ConfigurationManager.ts` | Add/update methods on the class |

### Which Files and Abstractions to Inspect

When making a change, inspect these files in this order:

1. **The affected source file** — e.g., `src/runtime/ConfigurationBuilder.ts` for runtime builder changes.
2. **The definition file** — e.g., `src/runtime/definitions/RuntimeConfiguration.ts` for type and validation scheme.
3. **The index file** — e.g., `src/runtime/index.ts` to check current exports.
4. **The parent orchestrator** — `src/ConfigurationManager.ts` if the change affects the public facade.
5. **Dependent modules** — check if other modules import from the one you're changing (search for `from './runtime'` or `from './service'`).

### How to Identify Downstream Dependencies

Search for imports from the module you're modifying:

```bash
grep -r "from '\./runtime'" src/ test/
grep -r "from '\./service'" src/ test/
```

Also check the root `src/index.ts` — anything exported there is part of the public API and changing it may affect consumers across the monorepo.

### Understanding Existing Behavior Before Changing It

- Read the builder's `build()` method to understand how defaults are applied and validation works.
- Read the `ConfigurationReader.read()` method to understand file reading, env var interpolation, and error handling.
- Read the validation scheme to understand which fields are required vs optional and what types are expected.

---

## 2. Implementation Approach

### How to Extend Existing Functionality

#### Adding a Field to an Existing Configuration Type

1. **Update the type definition** in the relevant `definitions/*Configuration.ts` file (add the optional field to the type).
2. **Update the validation scheme** in the same file (add the field with its type and `required: false`).
3. **Update the builder** (if defaults are needed) — apply defaults with `configuration.field ??= DefaultValues.FIELD`.
4. **Update any test fixtures** to reflect the new field in expected outputs.
5. **Update the index file** if the type is newly exported.

#### Adding a New Service Sub-Type

1. **Create the type and validation scheme** in a new `service/definitions/<TypeName>Configuration.ts` file following the established pattern:
   ```ts
   type <TypeName>Configuration =
   {
       field1?: string;
       field2?: number;
   };

   export default <TypeName>Configuration;

   const validationScheme: ValidationScheme =
   {
       field1: { type: 'string', required: false },
       field2: { type: 'integer', required: false }
   } as const;

   export { validationScheme };
   ```
2. **Import and register** the new type in `ServiceConfiguration.ts` — add it as an optional property on `ServiceConfiguration` and add a `group` entry to `validationScheme` referencing the new validation scheme.
3. **Export** the type from `service/index.ts` using `export { default as <TypeName>Configuration } from './definitions/<TypeName>Configuration'`.
4. **Update tests** — add fixture data and test cases.

#### Adding a New Runtime Configuration Field

Follow the same pattern as service sub-types but within the `runtime/` module. Apply defaults in `ConfigurationBuilder.build()` using nullish coalescing assignment (`??=`).

### How to Modify the ConfigurationReader

Changes to `ConfigurationReader` affect all builders. Before modifying:

1. Understand the env var interpolation regex: `/\${([^}]*)}/g`.
2. Remember that missing env vars resolve to the string `'null'` (not `null`).
3. The reader returns `{}` for non-existing files — do not change this behavior.
4. Non-JSON files throw `InvalidConfigurationFile` — only `.json` files are accepted.

### How to Modify the ConfigurationManager

If adding a new public method:

1. Add the method to `ConfigurationManager` that delegates to the appropriate builder.
2. Update `src/index.ts` to export any new types.
3. Add tests for the new method via `ConfigurationManager` integration.

---

## 3. Code Conventions

### File Organization

- **1 file per logical component** — one class, one type, or one error per file.
- **Group related types and their validation schemes** in the same file (e.g., `RuntimeConfiguration.ts` contains the type definition, `DefaultValues`, and `validationScheme`).
- **Error classes** go in `errors/` subdirectories (e.g., `src/runtime/errors/RuntimeConfigurationInvalid.ts`).
- **Index files** re-export all public members using `export { default as <Name> }` pattern.
- **Every sub-module** (`runtime/`, `service/`, `utils/`, `environment/`) must have an `index.ts` that re-exports all public members.

### Naming and Export Patterns

```ts
// Type definition (file: definitions/RuntimeConfiguration.ts)
type RuntimeConfiguration = { ... };
export default RuntimeConfiguration;

// Shared values (same file)
const DefaultValues = { ... };
const validationScheme: ValidationScheme = { ... } as const;
export { DefaultValues, validationScheme };

// Error class (file: errors/RuntimeConfigurationInvalid.ts)
export default class RuntimeConfigurationInvalid extends Error { ... }

// Index file (file: runtime/index.ts)
export { default as RuntimeConfigurationInvalid } from './errors/RuntimeConfigurationInvalid';
export { default as RuntimeConfiguration } from './definitions/RuntimeConfiguration';
export { default as RuntimeConfigurationBuilder } from './ConfigurationBuilder';
```

### Class Patterns

- Use `export default class` for all classes (builders, configurators).
- Use JavaScript private fields with `#fieldName` syntax (e.g., `#reader`, `#validator`).
- Constructor parameters are readonly: `readonly #fieldName: Type`.
- Builder constructors take dependencies explicitly: `constructor(reader: ConfigurationReader, validator: Validator)`.

### Validation Scheme Patterns

- Use `as const` on all validation scheme objects.
- Supported field types: `string`, `url`, `integer`, `boolean`, `list` (with optional `items`), `group` (with nested `fields`).
- All fields are optional unless explicitly marked `required: true`.
- Nested groups reference the child's `validationScheme` directly:

```ts
const validationScheme: ValidationScheme =
{
    http: { type: 'group', required: false, fields: httpValidationScheme },
    gateway: { type: 'group', required: false, fields: gatewayValidationScheme },
};
```

### Error Message Formats

Each error class has a specific message format that tests verify:

- **RuntimeConfigurationInvalid**: `Invalid runtime configuration '<filename>'\n<error messages joined by '\n'>`
- **ServiceConfigurationInvalid**: `Invalid server configuration '<filename>'\n => <error messages joined by '\n => '>`
- **InvalidConfigurationFile**: `'<filename>' is not a valid configuration file.`

### Import Ordering

1. External dependencies first (e.g., `@jitar/validation`, `@jitar/sourcing`, `dotenv`).
2. Core dependencies (workspace aliases `@jitar/...`) second.
3. Runtime dependencies (relative imports within package) third.
4. Types last.

Within each block, imports are sorted alphabetically.

### Default Values Pattern

Default values are defined as a const object and applied via nullish coalescing assignment in builders:

```ts
// In definitions/RuntimeConfiguration.ts
const DefaultValues =
{
    FILENAME: './jitar.json',
    SOURCE: './src',
    TARGET: './dist',
    SEGMENTS: './segments',
    RESOURCES: './resources',
    BUILD: { ignore: [] },
    BUILD_IGNORE: []
};

// In ConfigurationBuilder.ts
configuration.source ??= DefaultValues.SOURCE;
configuration.target ??= DefaultValues.TARGET;
configuration.build.ignore ??= DefaultValues.BUILD_IGNORE;
```

### Meta Property Pattern

Both builders add a `meta` property with `root` and `configFile`:

```ts
configuration.meta =
{
    root: this.#reader.getRootLocation(),
    configFile: filename
};
```

### Service Configuration Sub-Type Composition

Some service sub-types are composed from other types:

- `StandaloneConfiguration = RepositoryConfiguration & Pick<WorkerConfiguration, 'segments'>`
- Its validation scheme spreads the component schemes: `...repositoryScheme, segments: workerScheme.segments`

---

## 4. Testing

### How to Identify Relevant Tests

Tests mirror the source structure:

| Source Module | Test Module | Test File |
|---|---|---|
| `src/runtime/ConfigurationBuilder.ts` | `test/runtime/` | `ConfigurationBuilder.spec.ts` |
| `src/service/ConfigurationBuilder.ts` | `test/server/` | `ConfigurationBuilder.spec.ts` |
| `src/utils/ConfigurationReader.ts` | `test/utils/` | `ConfigurationReader.spec.ts` |
| `src/environment/Configurator.ts` | `test/environment/` | `Configurator.spec.ts` |

### How to Add Tests for New Functionality

1. **Create/update fixture files** in `test/<module>/fixtures/` mirroring the source structure:
   - `configuration.fixture.ts` — input and expected output configurations
   - `files.fixture.ts` — mock `File` objects for the `FileManager`
   - `filenames.fixture.ts` — filename constants
   - `validation.fixture.ts` — mock `ValidationResult` for error cases
   - `index.ts` — assembles fixtures into exports

2. **Write test cases** using these patterns:

   **Success case:**
   ```ts
   it('should build a valid runtime configuration from a valid file', async () =>
   {
       const promise = configurationBuilder.build(FILENAMES.VALID);

       await expect(promise).resolves.toEqual(CONFIGURATIONS.RESULT.RUNTIME);
   });
   ```

   **Error case:**
   ```ts
   it('should reject an invalid runtime configuration', async () =>
   {
       const promise = configurationBuilder.build(FILENAMES.INVALID);

       await expect(promise).rejects.toEqual(new RuntimeConfigurationInvalid(FILENAMES.INVALID, VALIDATION_RESULT));
   });
   ```

   **Environment variable test:**
   ```ts
   it('should read json configuration with environment variables', async () =>
   {
       vi.stubEnv(CONFIGURATIONS.ENV_VARIABLES.TARGET_PATH_KEY, CONFIGURATIONS.ENV_VARIABLES.TARGET_PATH_VALUE);

       const configuration = await reader.read(FILENAMES.ENV_VARIABLES);

       expect(configuration).toEqual(CONFIGURATIONS.ENV_RESULT);

       vi.unstubAllEnvs();
   });
   ```

3. **Test edge cases**:
   - Missing configuration files (returns defaults).
   - Non-JSON files (throws `InvalidConfigurationFile`).
   - Invalid configuration structure (throws appropriate error).
   - Environment variable interpolation (including missing env vars resolving to `'null'`).
   - Partial configurations (only some fields provided, rest get defaults).

### Existing Fixtures, Mocks, and Utilities

- **`TestFileManager`** (`test/fixtures/fileManager.fixture.ts`) — implements the `FileManager` interface for tests. Construct with a `Record<string, File>` to mock file existence and content.
- **`FILES` fixtures** — each test module has a `FILES` record mapping filenames to mock `File` objects.
- **`CONFIGURATIONS` fixtures** — contain both `INPUT` (raw JSON-like objects) and `RESULT` (fully built configurations with defaults and meta applied).
- **`VALIDATION_RESULT`** — a mock `ValidationResult` with `valid: false` and error messages.

### How to Verify Behavior

- Run `npm run test` to verify all tests pass.
- Run `npm run test-coverage` to check coverage.
- Verify that both success and error paths are tested.
- Verify that existing tests still pass after changes.

---

## 5. Validation

### Commands

| Command | Purpose |
|---|---|
| `npm run lint` | Run ESLint. Do not disable rules without approval. |
| `npm run build` | Compile TypeScript (`tsc -p tsconfig.json`). |
| `npm run test` | Run all tests via `vitest`. |
| `npm run test-coverage` | Run tests with v8 coverage. |
| `npm run clean` | Remove `dist/` directory. |

### Validation Procedure

After making any code change:

1. **Run lint**: `npm run lint` — fix any errors. Do not disable ESLint rules without approval.
2. **Run build**: `npm run build` — verify TypeScript compiles without errors.
3. **Run tests**: `npm run test` — verify all tests pass, including existing ones.
4. **Run tests with coverage** (optional but recommended): `npm run test-coverage`.

### Final Diff Inspection

Before considering a change complete:

- [ ] All existing tests pass.
- [ ] New tests cover the new functionality and edge cases.
- [ ] No lint errors.
- [ ] No build errors.
- [ ] Public API changes are minimal and documented.
- [ ] New types are exported through the appropriate `index.ts` files.
- [ ] New service sub-types are registered in `ServiceConfiguration` and its validation scheme.
- [ ] Default values are defined and applied in the builder.
- [ ] Error message formats are preserved.
- [ ] Workspace aliases are used for cross-package imports.
- [ ] Relative paths are used for intra-package imports.

---

## 6. Completion Criteria

An implementation is complete when all of the following are true:

1. **Source code**:
   - New or modified files follow the established file organization (1 file per component).
   - Classes use `export default`, types use `export default`, shared values use named exports.
   - Index files re-export all public members using `export { default as <Name> }`.
   - Validation schemes use the correct field types and `as const`.
   - Default values are defined and applied via nullish coalescing assignment.
   - Error classes follow the established message format.

2. **Tests**:
   - New test file(s) mirror the source structure (`test/<module>/<ComponentName>.spec.ts`).
   - Fixtures are updated or created in `test/<module>/fixtures/`.
   - Both success and error paths are tested.
   - Edge cases are covered (missing files, invalid files, env var substitution).
   - All existing tests still pass.

3. **Validation**:
   - `npm run lint` passes with no errors.
   - `npm run build` succeeds without TypeScript errors.
   - `npm run test` passes for all tests.

4. **Documentation**:
   - Any changes to configuration types are reflected in the package `AGENTS.md` (if the change affects documented types).
   - New service sub-types are documented in the service sub-type table.

---

## 7. Uncertainties and Missing Information

The following areas may require clarification before implementation:

- **StandaloneConfiguration inheritance**: The type is defined as `RepositoryConfiguration & Pick<WorkerConfiguration, 'segments'>`. The validation scheme spreads `repositoryScheme` and adds `workerScheme.segments`. Confirm this pattern is intentional when modifying `StandaloneConfiguration`.
- **RemoteWorkerConfiguration**: Only present alongside `gateway` in `ServiceConfiguration`. Confirm the semantic relationship before changing how it is validated.
- **Environment variable `'null'` behavior**: Missing env vars resolve to the string `'null'`, not `null`. This is a known behavior but may cause confusion — consider documenting this prominently when adding new env var usage.
- **ConfigurationReader returns `{}` for missing files**: This is intentional and allows defaults to be applied. Do not change this behavior without confirming it does not break downstream builders.