---
disabled: true
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

1. **Create a new definition file** at `src/service/definitions/<Name>Configuration.ts` with the type, `validationScheme`, and `export default` for the type, `export { validationScheme }` for the scheme.
2. **Import and register it** in `src/service/definitions/ServiceConfiguration.ts` (import type and validation scheme).
3. **Add the optional field** to the `ServiceConfiguration` type.
4. **Add the validation group** to the `validationScheme` (using `type: 'group'` with `fields: <name>ValidationScheme`).
5. **Update the index file** at `src/service/index.ts` (export `{ default as <Name> }`).
6. **Update the root index** at `src/index.ts` if the type should be publicly exported.

#### Modifying the ConfigurationReader

If you need to change how configuration files are read:

- The `ConfigurationReader` receives a `FileManager` via its constructor.
- It checks file existence (returns `{}` if not found).
- It validates file type (`file.type.includes('json')`).
- It performs env var interpolation using the regex `\${([^}]*)}`.
- It parses the interpolated JSON.

**Do not** change the return type (`Promise<Record<string, unknown>>`). All builders depend on this contract.

### Where New Code Should Be Placed

Follow the established directory structure:

```
src/
├── <module>/
│   ├── <ComponentName>.ts          # The implementation (export default)
│   ├── definitions/
│   │   └── <TypeName>.ts           # Type + DefaultValues + validationScheme
│   └── errors/
│       └── <ErrorName>.ts          # Error class (export default)
└── <module>/index.ts               # Re-exports
```

- **Classes**: `src/<module>/<ComponentName>.ts` (e.g., `src/runtime/ConfigurationBuilder.ts`).
- **Types + validation**: `src/<module>/definitions/<TypeName>.ts`.
- **Errors**: `src/<module>/errors/<ErrorName>.ts`.
- **Index files**: One per module, re-exporting all public members.

### How to Maintain Package Boundaries

- **Within the package**: Use relative imports (e.g., `from '../utils'`, `from './definitions/RuntimeConfiguration'`).
- **Across packages**: Use workspace aliases (e.g., `from '@jitar/sourcing'`, `from '@jitar/validation'`). Never use relative paths across `packages/`.
- **Do not export** types, classes, or functions from a module's index unless they are consumed by another module or part of the public API.
- **Do not introduce** new dependencies. If you need a new dependency, justify it in the implementation and get approval.

---

## 3. Code Conventions

### How to Handle Types, Validation, and Errors

#### Validation Scheme Types

The package supports these validation scheme field types (from `@jitar/validation`):

| Type | Description | Example |
|---|---|---|
| `string` | A string value | `{ type: 'string', required: false }` |
| `url` | A URL string | `{ type: 'url', required: true }` |
| `integer` | An integer number | `{ type: 'integer', required: false }` |
| `boolean` | A boolean value | `{ type: 'boolean', required: false }` |
| `list` | An array of items | `{ type: 'list', items: { type: 'string' }, required: false }` |
| `group` | Nested object with fields | `{ type: 'group', fields: { ... }, required: false }` |

**Rules:**
- All fields are optional unless explicitly marked `required: true`.
- Use `as const` on the entire `validationScheme` object.
- Group fields reference the `validationScheme` from the referenced type (e.g., `StandaloneConfiguration` uses `repositoryScheme` and `workerScheme`).

#### Error Classes

Each module has its own error class:

| Module | Error Class | Message Format |
|---|---|---|
| `utils/` | `InvalidConfigurationFile` | `'<filename>' is not a valid configuration file.` |
| `runtime/` | `RuntimeConfigurationInvalid` | `Invalid runtime configuration '<filename>'\n<error messages>` |
| `service/` | `ServiceConfigurationInvalid` | `Invalid server configuration '<filename>'\n => <error messages joined by '\n => '>` |

**Rules:**
- Error classes extend `Error`.
- Use `export default` for error classes.
- Error classes receive the filename and validation result from the builder.
- Error message format must be consistent — do not change the format without approval.

#### Default Values

Default values are defined as a `const DefaultValues` object in the same file as the type definition:

```ts
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

export { DefaultValues };
```

Default values are applied in the builder using nullish coalescing:

```ts
configuration.source ??= DefaultValues.SOURCE;
configuration.build ??= DefaultValues.BUILD;
configuration.build.ignore ??= DefaultValues.BUILD_IGNORE;
```

### How to Preserve Compatibility

- **Public API**: The `ConfigurationManager` exposes three methods: `configureEnvironment()`, `getRuntimeConfiguration()`, and `getServiceConfiguration()`. Do not change method signatures without approval.
- **Return types**: Builders return `Promise<RuntimeConfiguration>` or `Promise<ServiceConfiguration>`. Do not change the return type.
- **Error contracts**: Error classes are caught by consumers. Changing error message formats may break error handling in consuming packages.
- **Private package**: This package is consumed by other packages within the monorepo. Breaking changes will affect downstream packages.

---

## 4. Code Conventions (Examples)

### Pattern 1: Class with Private Fields

```ts
export default class ConfigurationBuilder
{
    readonly #reader: ConfigurationReader;
    readonly #validator: Validator;

    constructor(reader: ConfigurationReader, validator: Validator)
    {
        this.#reader = reader;
        this.#validator = validator;
    }

    async build(filename: string = DefaultValues.FILENAME): Promise<RuntimeConfiguration>
    {
        const configuration = await this.#reader.read(filename) as RuntimeConfiguration;
        const validation = this.#validator.validate(configuration, validationScheme);

        if (validation.valid === false)
        {
            throw new RuntimeConfigurationInvalid(filename, validation);
        }

        configuration.source ??= DefaultValues.SOURCE;
        configuration.target ??= DefaultValues.TARGET;

        configuration.meta =
        {
            root: this.#reader.getRootLocation(),
            configFile: filename
        };

        return configuration;
    }
}
```

Key observations:
- Classes use `export default`.
- Private fields use JavaScript `#` syntax with `readonly`.
- Constructor parameters are not typed with visibility modifiers.
- Open curly braces go on the next line (Allman style).
- Fields are applied with `??=` (nullish coalescing assignment).
- `meta` is always set (not optional).

### Pattern 2: Type Definition with Validation Scheme

```ts
type GatewayConfiguration =
{
    monitorInterval?: number;
    trustKey?: string;
};

export default GatewayConfiguration;

const validationScheme: ValidationScheme =
{
    monitorInterval: { type: 'integer', required: false },
    trustKey: { type: 'string', required: false }
} as const;

export { validationScheme };
```

Key observations:
- Type is `export default`.
- `validationScheme` is exported as a named export.
- `validationScheme` is typed as `ValidationScheme` and cast with `as const`.
- Type definition and validation scheme are in the same file.

### Pattern 3: Index File Re-exports

```ts
export { default as ServiceConfigurationInvalid } from './errors/ServiceConfigurationInvalid';
export { default as ServiceConfiguration } from './definitions/ServiceConfiguration';
export { default as ServiceConfigurationBuilder } from './ConfigurationBuilder';
```

Key observations:
- Use `export { default as <Name> }` pattern.
- Order: errors first, then types, then builders.
- One line per export.

### Pattern 4: Fixture Builder for Tests

```ts
const fileManager = new FileManager(FILES);
const configurationReader = new ConfigurationReader(fileManager);
const validator = new Validator();

const configurationBuilder = new RuntimeConfigurationBuilder(configurationReader, validator);

export { configurationBuilder, FILENAMES, CONFIGURATIONS, RuntimeConfigurationInvalid, VALIDATION_RESULT };
```

Key observations:
- Fixtures construct the full dependency chain.
- `TestFileManager` replaces `LocalFileManager`.
- `Validator` is the real implementation (no mock needed).
- Fixtures export the builder, filenames, configurations, errors, and validation results.

### Naming and Organization Conventions

| Element | Convention | Example |
|---|---|---|
| Class name | PascalCase | `ConfigurationBuilder` |
| Private field | `#camelCase` | `#reader`, `#validator` |
| Method name | camelCase | `build()`, `read()` |
| Type name | PascalCase | `RuntimeConfiguration`, `ServiceConfiguration` |
| Constant | PascalCase | `DefaultValues`, `FILENAMES` |
| Validation scheme | camelCase | `validationScheme` |
| Test file | `<ComponentName>.spec.ts` | `ConfigurationBuilder.spec.ts` |
| Fixture file | `<name>.fixture.ts` | `configuration.fixture.ts` |
| Module index | `index.ts` | `src/runtime/index.ts` |

### Preferred Approaches to Common Implementation Problems

| Problem | Approach |
|---|---|
| Optional field with default | Define in type as `field?: Type`, apply in builder with `configuration.field ??= DefaultValues.FIELD` |
| Nested configuration | Use `group` validation type with `fields` referencing another validation scheme |
| Inherited type (StandaloneConfiguration) | Intersection type: `type A = TypeB & Pick<TypeC, 'field'>` |
| Missing env var | Resolves to string `'null'` — document this behavior |
| Non-existing config file | Returns `{}` — allows defaults to be applied |
| Non-JSON file | Throws `InvalidConfigurationFile` |
| Validation failure | Throws module-specific error class with filename and validation result |

### Patterns to Avoid

| Pattern | Why |
|---|---|
| Exporting types/functions not shared across components | Violates the "do not export unless shared" rule |
| Using `null` instead of `undefined` | The package convention is to use `undefined` |
| Using relative paths across packages | Must use workspace aliases (`@jitar/...`) |
| Disabling ESLint rules with inline comments | Must get explicit approval before doing so |
| Changing error message formats | Consumers may parse error messages |
| Adding new dependencies without justification | This is a private package with fixed dependencies |
| Modifying `ConfigurationManager` method signatures | Breaking change for all consumers |

---

## 5. Testing

### How to Identify Relevant Tests

Tests mirror the source directory structure:

| Source | Test |
|---|---|
| `src/runtime/ConfigurationBuilder.ts` | `test/runtime/ConfigurationBuilder.spec.ts` |
| `src/service/ConfigurationBuilder.ts` | `test/server/ConfigurationBuilder.spec.ts` |
| `src/utils/ConfigurationReader.ts` | `test/utils/ConfigurationReader.spec.ts` |
| `src/environment/Configurator.ts` | `test/environment/Configurator.spec.ts` |

Look in `test/<module>/fixtures/` for test fixtures that support the tests.

### How to Add Tests for New Functionality

1. **Add test cases** to the existing `.spec.ts` file (use `describe('<module>/<ComponentName>')` and `it('should <behavior>')`).
2. **Update fixtures** in `test/<module>/fixtures/`:
   - Add filenames to `filenames.fixture.ts`.
   - Add file entries to `files.fixture.ts` using `new File(filename, 'text/json', JSON.stringify(data))`.
   - Add input/output configurations to `configuration.fixture.ts`.
   - Add validation results to `validation.fixture.ts` (if testing invalid configurations).
   - Update the fixture index to export new fixtures and the constructed builder.
3. **Test both success and error paths**:
   - Success: `await expect(promise).resolves.toEqual(<expected>)`.
   - Error: `await expect(promise).rejects.toEqual(new <ErrorClass>(filename, validationResult))`.
4. **Test edge cases**:
   - Missing configuration file (returns defaults).
   - Invalid configuration file (throws validation error).
   - Non-JSON file (throws `InvalidConfigurationFile`).
   - Environment variable interpolation (with `vi.stubEnv()` / `vi.unstubAllEnvs()`).
   - Partial configuration (some fields provided, rest defaulted).

### Important Edge Cases

| Edge Case | Expected Behavior |
|---|---|
| Config file does not exist | Builder returns configuration with all defaults applied. |
| Config file is valid JSON but missing fields | Builder applies defaults for missing fields. |
| Config file has unknown fields | Validation fails, throws configuration error. |
| Config file is not JSON (wrong MIME type) | `ConfigurationReader` throws `InvalidConfigurationFile`. |
| Missing environment variable in interpolation | Resolves to the string `'null'`. |
| Empty configuration object `{}` | All defaults are applied by the builder. |

### Existing Fixtures, Mocks, and Utilities

- **TestFileManager** (`test/fixtures/fileManager.fixture.ts`): Implements `FileManager` interface. Takes a `Record<string, File>` in the constructor. `exists()` and `read()` search by `location` property.
- **File** (`@jitar/sourcing`): `new File(location, mimeType, content)` — used in fixtures to represent configuration files.
- **Validator** (`@jitar/validation`): Real implementation used in tests — no mock needed.
- **ConfigurationReader** (`src/utils/ConfigurationReader`): Real implementation used in tests — receives a `TestFileManager`.

### How to Verify Behavior

1. Run tests: `npm run test`.
2. Run with coverage: `npm run test-coverage`.
3. Ensure all existing tests pass (not just the ones you touched).
4. Verify that both success and error paths are covered.
5. For environment variable tests, use `vi.stubEnv()` and `vi.unstubAllEnvs()` properly.

---

## 6. Validation

### Relevant Commands

| Command | Purpose |
|---|---|
| `npm run lint` | Run ESLint across the package. |
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

## 7. Completion Criteria

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

## 8. Uncertainties and Missing Information

The following areas may require clarification before implementation:

- **StandaloneConfiguration inheritance**: The type is defined as `RepositoryConfiguration & Pick<WorkerConfiguration, 'segments'>`. The validation scheme spreads `repositoryScheme` and adds `workerScheme.segments`. Confirm this pattern is intentional when modifying `StandaloneConfiguration`.
- **RemoteWorkerConfiguration**: Only present alongside `gateway` in `ServiceConfiguration`. Confirm the semantic relationship before changing how it is validated.
- **Environment variable `'null'` behavior**: Missing env vars resolve to the string `'null'`, not `null`. This is a known behavior but may cause confusion — consider documenting this prominently when adding new env var usage.
- **ConfigurationReader returns `{}` for missing files**: This is intentional and allows defaults to be applied. Do not change this behavior without confirming it does not break downstream builders.