# @jitar/validation

This file extends the root [`AGENTS.md`](../../AGENTS.md) with information specific to the validation package.

## Purpose

This package provides data validation for the Jitar runtime. It allows developers to define a **validation scheme** that describes the expected structure and types of data, then validate arbitrary data objects against that scheme.

## Exports

Three items are exported from `src/index.ts`:

| Exported Symbol | Type | Description |
|---|---|---|
| `ValidationScheme` | type | Schema definition for validation rules |
| `ValidationResult` | type | Result of a validation operation |
| `Validator` | class | Core validation engine |

The field types `FieldValidation`, `PrimitiveValidation`, `GroupValidation`, `ListValidation`, and `EnumValidation` are exported from `src/types/ValidationScheme.ts` but not from the package root.

## Dependencies

| Package | Usage |
|---|---|
| `@jitar/errors` | Error types and utilities (declared dependency, though not currently used in source code) |

## Package structure

```
src/
├── index.ts                    ← Main entry point — re-exports ValidationScheme, ValidationResult, Validator
├── Validator.ts                ← Core validator — validates data against a scheme
└── types/
    ├── ValidationScheme.ts     ← Scheme type definitions (primitives, groups, lists, enums)
    └── ValidationResult.ts     ← Result type (valid: boolean, errors: string[])
test/
├── Validator.spec.ts           ← Validator tests
└── fixtures/                   ← Test fixtures (schemes, values, messages)
    ├── index.ts
    ├── validationSchemes.fixture.ts
    └── values.fixture.ts
```

## Architecture

### Overview

The package is organized into four source files plus a test directory.

#### Component Responsibilities

| Component | Responsibility |
|---|---|
| `Validator` | Core validation engine — validates data against a scheme, supports strict and lenient modes |
| `ValidationScheme` | Type definition for validation schemes — describes expected fields, types, and constraints |
| `ValidationResult` | Type definition for validation results — contains `valid` boolean and `errors` array |

#### Validator Class

The `Validator` class is the central component. It accepts a `strict` boolean in its constructor (default `true`):

| Method | Description |
|---|---|
| `validate(data, scheme)` | Validates the given data against the scheme. Returns a `ValidationResult`. |

Internal behavior:

- **Strict mode** (default): Rejects fields present in the data but not defined in the scheme.
- **Lenient mode**: Ignores extra fields not defined in the scheme.
- Supports nested validation for `group` and `list` types via recursive validation.
- Composes dot-notation keys for nested error messages (e.g., `group.integer`).
- All errors are collected (validation does not stop at the first error); `valid` is `true` when the error list is empty.

#### Supported Validation Types

| Type | Description | Validation |
|---|---|---|
| `'string'` | String values | `typeof value === 'string'` |
| `'integer'` | Integer numbers | `typeof value === 'number' && Number.isInteger(value)` |
| `'real'` | Real (floating-point) numbers | `typeof value === 'number'` |
| `'boolean'` | Boolean values | `typeof value === 'boolean'` |
| `'url'` | URL strings | `typeof value === 'string' && value.startsWith('http')` |
| `'group'` | Nested object with fields | `typeof value === 'object'`, then recursively validates sub-fields |
| `'list'` | Array of items | `Array.isArray(value)`, then validates each item against `items` scheme |
| `'enum'` | Enumerated values | Value must be one of the `options` array |

Each field can optionally have `required: true` to enforce presence. Missing (`undefined`) optional fields are skipped.

#### ValidationScheme Type

```typescript
type ValidationScheme = Record<string, FieldValidation>;
```

Where `FieldValidation` is a union of:
- `PrimitiveValidation` — `{ type: 'string' | 'integer' | 'real' | 'boolean' | 'url', required?: boolean }`
- `GroupValidation` — `{ type: 'group', required?: boolean, fields: Record<string, FieldValidation> }`
- `ListValidation` — `{ type: 'list', required?: boolean, items: PrimitiveValidation }`
- `EnumValidation` — `{ type: 'enum', required?: boolean, options: unknown[] }`

All properties are `readonly`; `required` comes from a shared `BaseValidation` type.

#### ValidationResult Type

```typescript
type ValidationResult =
{
    valid: boolean;
    errors: string[];
};
```

### Decisions

- **Strict by default**: The `strict` constructor parameter defaults to `true` by design; extra fields are rejected unless lenient mode is chosen explicitly.
- **Errors as strings**: Validation returns a result with human-readable messages instead of throwing.
- **Stable message formats**: Error message formats are fixed; tests assert exact message strings.
- **Primitive list items only**: `ListValidation.items` is a `PrimitiveValidation`, so lists of groups/enums are not supported.

## Coding Conventions

### File Organization

- **1 file per logical component** (class or type).
- Shared types live under `src/types/`.
- Index file re-exports all public members.

### Exports

- **Classes**: `export default` (e.g., `export default class Validator`).
- **Types**: `export default` for shared types (e.g., `ValidationResult`), `export type` for type unions (e.g., `FieldValidation`).
- **Index files**: Re-export using `export { default as <Name> }` pattern.

### Private Fields

- Use JavaScript private syntax (`#`) for all private properties and methods.
- Private fields are declared at the top of the class body.

### Naming

- Class names: `PascalCase` (e.g., `Validator`).
- Private fields: `#camelCase` (e.g., `#strict`).
- Private methods: `#camelCase` (e.g., `#validateData`, `#validateKeys`, `#composeKey`).
- Type names: `PascalCase` (e.g., `ValidationScheme`, `ValidationResult`).

## Testing Conventions

### Test Structure

- Tests live in `test/` directory.
- Test file is named `Validator.spec.ts`.
- Use `vitest` with `describe`, `it`, `expect`.
- Fixtures live in `test/fixtures/`: `validationSchemes.fixture.ts` (`VALIDATION_SCHEMES`) and `values.fixture.ts` (`VALUES.MESSAGES`, expected error message constants).

### Test Organization

- Use `describe('Validator')` for class-level tests.
- Use `describe('Type values')` for type-grouped sub-describes (e.g., 'String values', 'Integer values', 'Real values', 'Boolean values', 'URL values', 'Optional values', 'Group values', 'List values', 'Enum values', 'Complex values', 'Strict mode', 'Lenient mode').
- Use `it('should <behavior>')` for individual test cases.
- Create validator instances once at the top of the spec file (e.g., `const strictValidator = new Validator(true)`, `const lenientValidator = new Validator(false)`).
- Use fixtures imported from `./fixtures` for scheme definitions and expected error messages.

### Test Coverage

Each validation type should be tested for:
- Accepting a valid value
- Rejecting an invalid value (wrong type)
- Rejecting a missing required value

Additional tests:
- Optional values (missing values are accepted)
- Nested/complex group validation
- Strict mode (rejecting extra fields)
- Lenient mode (accepting extra fields)

## Configuration

- Extends root `tsconfig.json` with `rootDir: ./src` and `outDir: ./dist`.
- Package is `private: true` — it is not published independently.
- TypeScript target: `esnext`, module: `esnext`, moduleResolution: `bundler`.
- Test coverage uses the `v8` provider via `vitest.config.ts`.

## Key Implementation Details

### Strict vs Lenient Mode

The `Validator` constructor accepts a `strict` parameter (default `true`):

- **Strict mode**: Checks for extra fields in the data that are not defined in the scheme. These are reported as `Unknown field '<key>'` errors. This also applies to nested groups.
- **Lenient mode**: Skips extra field checking, only validating fields defined in the scheme.

### Nested Validation

- **Groups**: When a field has `type: 'group'`, the validator recursively validates the nested object against the group's `fields` scheme. Keys are composed with dot notation (e.g., `group.field`).
- **Lists**: When a field has `type: 'list'`, the validator iterates over each array item and validates it against the `items` scheme. Items are indexed (e.g., `list.0`, `list.1`).

### Error Messages

Error messages follow a consistent format:

| Scenario | Message Format |
|---|---|
| Missing required field | `Field '<key>' is required` |
| Wrong type — string | `Field '<key>' is not a string` |
| Wrong type — integer | `Field '<key>' is not an integer` |
| Wrong type — real | `Field '<key>' is not a real number` |
| Wrong type — boolean | `Field '<key>' is not a boolean` |
| Invalid URL | `Field '<key>' is not a valid URL` |
| Wrong type — group | `Field '<key>' is not an object` |
| Wrong type — list | `Field '<key>' is not a list` |
| Extra field (strict mode) | `Unknown field '<key>'` |
| Invalid list item | `Field '<listKey>.<index>' is not a <type>` (using the item type's message) |
| Invalid enum value | `Field '<key>' is not one of: <options>` (options joined with `, `) |

## Constraints and Important Considerations

- This package is `private: true` — it is never published independently.
- The `@jitar/errors` dependency is declared but not yet used in source code.
- The `Validator` class is the only public class; never expose additional classes without re-exporting them.
- Do not change error message formats — tests assert exact message strings.
- Do not change the default `strict` mode; it is `true` by design.

## Workflow

When working with this package:

1. **Read the source**: Understand the component's role within the package.
2. **Follow naming conventions**: Class names `PascalCase`, `#` for private, `camelCase` for methods.
3. **Use workspace aliases**: Import from `@jitar/errors`, never relative paths across packages.
4. **Export through index files**: Every public class and type must be re-exported via `src/index.ts`.
5. **Write tests**: Create tests that cover valid, invalid, and missing value scenarios for each type.
6. **Run `npm run lint`** after making changes.
7. **Run `npm run test`** to verify all tests pass.
8. **Consult the root `AGENTS.md`** for monorepo-wide conventions (linting configuration, build commands, workspace alias rules).

## Commands

| Command | Script | Description |
|---|---|---|
| `npm run test` | `vitest run` | Run tests |
| `npm run test-coverage` | `vitest run --coverage` | Run tests with coverage |
| `npm run lint` | `eslint` | Lint source files |
| `npm run build` | `tsc -p tsconfig.json` | Compile to `./dist` |
| `npm run clean` | `shx rm -rf dist` | Remove build artifacts |

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
