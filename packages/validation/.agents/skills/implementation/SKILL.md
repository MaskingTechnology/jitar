---
name: implementation
description: Guide AI coding agents when implementing new features, modifying existing functionality, or refactoring code in @jitar/validation. Use when adding validation types, extending the Validator class, or modifying validation logic.
---

# Implementation

## Overview

This skill guides implementation work within `@jitar/validation`. It covers how to inspect the codebase, extend existing functionality, write tests, and verify changes. Refer to the package [`AGENTS.md`](../../../AGENTS.md) for architecture, supported types, error messages, and constraints. Refer to the monorepo root [`AGENTS.md`](../../../AGENTS.md) for global conventions (linting, builds, workspace aliases).

## When to Use

Invoke this skill when:
- Adding a new validation type (e.g., `'date'`, `'email'`).
- Modifying validation logic for an existing type.
- Extending the `Validator` class with new behavior.
- Refactoring internal validation methods.
- Adding or updating test fixtures.

## Do Not Use For

- Code review (use the `code-review` skill).
- Changes outside this package (consult the relevant package's `AGENTS.md`).

---

## 1. Understanding the Task

### Identify the Affected Functionality

Determine which part of the package your work touches:

| Area | Files to Inspect |
|---|---|
| Adding a validation type | `src/Validator.ts`, `src/types/ValidationScheme.ts` |
| Modifying validation logic | `src/Validator.ts` |
| Changing type definitions | `src/types/ValidationScheme.ts`, `src/types/ValidationResult.ts` |
| Updating tests | `test/Validator.spec.ts`, `test/fixtures/` |
| Changing exports | `src/index.ts` |

### Inspect Type Definitions First

Always start with `src/types/ValidationScheme.ts` — it defines every validation type:

```typescript
type FieldValidation = PrimitiveValidation | GroupValidation | ListValidation | EnumValidation;
```

Any new validation type must:
1. Be added to this union type.
2. Extend `BaseValidation` (which provides `readonly required?: boolean`).
3. Be a discriminated union on `type`.

### Follow the Validator's Internal Structure

The `Validator` class uses a three-level dispatch:

```
validate(data, scheme)          → public entry point
  └─ #validateData(key, data, scheme, errors)  → dispatches to keys + values
      ├─ #validateKeys(...)      → strict mode: checks for unknown fields
      └─ #validateValues(...)    → iterates scheme keys, dispatches per-type
          └─ #validateValue(key, value, scheme, errors)  → switch on scheme.type
              ├─ #validateString(...)
              ├─ #validateInteger(...)
              ├─ #validateReal(...)
              ├─ #validateBoolean(...)
              ├─ #validateUrl(...)
              ├─ #validateGroup(...)
              ├─ #validateList(...)
              └─ #validateEnum(...)
```

When adding a new validation type, you must:
1. Add the type to `FieldValidation` union in `src/types/ValidationScheme.ts`.
2. Add a `case` branch in the `#validateValue` switch statement.
3. Implement a dedicated `#validate<Type>` private method.
4. Add the type to the test suite in `test/Validator.spec.ts`.
5. Add fixtures in `test/fixtures/validationSchemes.fixture.ts`.
6. Add expected error messages in `test/fixtures/values.fixture.ts`.

### Understand Downstream Dependencies

This package has no downstream consumers in the monorepo that import from it yet (the `@jitar/errors` dependency is declared but unused). However:
- The `Validator` class is the **only** public API.
- All types are re-exported through `src/index.ts`.
- Error message strings are asserted in tests — never change them.

---

## 2. Implementation Approach

### Extending Existing Functionality

#### Adding a New Validation Type

**Step 1: Define the type in `src/types/ValidationScheme.ts`**

Add a new discriminated union member that extends `BaseValidation`:

```typescript
export type EmailValidation = BaseValidation &
{
    readonly type: 'email';
};
```

Then add it to the `FieldValidation` union:

```typescript
export type FieldValidation = PrimitiveValidation | GroupValidation | ListValidation | EnumValidation | EmailValidation;
```

**Step 2: Add a case in `#validateValue` and implement a private validator**

```typescript
case 'email':
    return this.#validateEmail(key, value, scheme, errors);
```

```typescript
#validateEmail(key: string, value: unknown, scheme: EmailValidation, errors: string[]): void
{
    if (typeof value !== 'string' || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value))
    {
        errors.push(`Field '${key}' is not a valid email`);
    }
}
```

**Step 3: Add fixtures and tests**

See the [Testing](#3-testing) section below.

### Where to Place New Code

| New Code | Location |
|---|---|
| New validation type definition | `src/types/ValidationScheme.ts` (append to existing type definitions) |
| New validator method | `src/Validator.ts` (append after existing `#validate*` methods) |
| New fixture scheme | `test/fixtures/validationSchemes.fixture.ts` (append to `VALIDATION_SCHEMES` object) |
| New error message constant | `test/fixtures/values.fixture.ts` (append to `MESSAGES` object) |
| New test cases | `test/Validator.spec.ts` (append a new `describe` block) |
| New public export | `src/index.ts` (add `export { default as <Name> }` line) |

### Maintaining Package Boundaries

- **Single public class**: `Validator`. Never expose additional classes without re-exporting them through `src/index.ts`.
- **Types**: Shared types live under `src/types/`. Internal types (like `Data`) stay private to `Validator.ts`.
- **No cross-package relative imports**: Use workspace aliases (`@jitar/errors`) when importing from other packages.
- **Private everything else**: All non-public methods and fields use `#` syntax.

### Preserving Compatibility

- **Error message formats are immutable**: Tests assert exact string matches. Adding a new type means choosing a new message format that follows the established pattern, but never changing existing messages.
- **Default strict mode is `true`**: Do not change it.
- **`ValidationResult` shape is fixed**: `{ valid: boolean; errors: string[] }`. Never add or remove properties.
- **`ValidationScheme` is `Record<string, FieldValidation>`**: The shape of a scheme never changes.

### Type Safety Patterns

- Use `readonly` on all type properties.
- Use discriminated unions (`type: 'string' | 'integer' | ...`) for type narrowing.
- Use `unknown` for unvalidated data, narrow to specific types in validators.
- Cast with `as` only when you have verified the type at runtime (e.g., `value as Record<string, unknown>` after `typeof value === 'object'`).

---

## 3. Testing

### How to Identify Relevant Tests

Tests live in `test/Validator.spec.ts`. They are organized by validation type using nested `describe` blocks:

```
describe('Validator')
  ├─ describe('String values')
  ├─ describe('Integer values')
  ├─ describe('Real values')
  ├─ describe('Boolean values')
  ├─ describe('URL values')
  ├─ describe('Group values')
  ├─ describe('List values')
  ├─ describe('Enum values')
  ├─ describe('Complex values')
  ├─ describe('Strict mode')
  └─ describe('Lenient mode')
```

When adding a new validation type, create a new `describe` block following this pattern.

### How to Add Tests for New Functionality

Each validation type should have three test cases:

```typescript
describe('Email values', () =>
{
    it('should accept a valid email', () =>
    {
        const data = { email: 'user@example.com' };
        const scheme = VALIDATION_SCHEMES.EMAIL;
        const result = strictValidator.validate(data, scheme);

        expect(result.valid).toBeTruthy();
    });

    it('should reject an invalid email', () =>
    {
        const data = { email: 'not-an-email' };
        const scheme = VALIDATION_SCHEMES.EMAIL;
        const result = strictValidator.validate(data, scheme);

        expect(result.valid).toBeFalsy();
        expect(result.errors).toContain(VALUES.MESSAGES.INVALID_EMAIL);
    });

    it('should reject a missing required email', () =>
    {
        const data = { email: undefined };
        const scheme = VALIDATION_SCHEMES.EMAIL;
        const result = strictValidator.validate(data, scheme);

        expect(result.valid).toBeFalsy();
        expect(result.errors).toContain(VALUES.MESSAGES.MISSING_EMAIL);
    });
});
```

### Important Edge Cases

| Scenario | Test |
|---|---|
| Missing required field | Value is `undefined` |
| Wrong type | Value is a different primitive (e.g., number instead of string) |
| Extra fields in strict mode | Data has fields not in the scheme |
| Nested groups | `type: 'group'` with sub-fields |
| Empty lists | `type: 'list'` with zero items |
| Optional fields | `required: false` — missing value is valid |

### Existing Fixtures, Mocks, and Utilities

**Fixtures live in `test/fixtures/`:**

| Fixture | Purpose |
|---|---|
| `validationSchemes.fixture.ts` | Pre-built `ValidationScheme` objects keyed by name (e.g., `VALIDATION_SCHEMES.STRING`) |
| `values.fixture.ts` | Expected error message constants (e.g., `VALUES.MESSAGES.INVALID_STRING`) |
| `index.ts` | Re-exports both fixture modules |

**Pattern for adding fixtures:**

```typescript
// In validationSchemes.fixture.ts
EMAIL: {
    email: { type: 'email', required: true }
},

// In values.fixture.ts
INVALID_EMAIL: `Field 'email' is not a valid email`,
MISSING_EMAIL: `Field 'email' is required`,
```

### How to Verify Behavior

Run the test suite:

```bash
npm run test
```

For coverage analysis:

```bash
npm run test-coverage
```

---

## 4. Validation

### Commands to Run

| Step | Command | Description |
|---|---|---|
| Type check | (implicit in lint) | TypeScript strict mode enforced by ESLint |
| Lint | `npm run lint` | Checks formatting, style, and TypeScript compliance |
| Test | `npm run test` | Runs all tests via `vitest run` |
| Coverage | `npm run test-coverage` | Runs tests with `v8` coverage provider |
| Build | `npm run build` | Compiles to `./dist` via `tsc -p tsconfig.json` |
| Clean | `npm run clean` | Removes `dist/` directory |

### Workflow After Making Changes

1. **Run `npm run lint`** — ensures formatting and style compliance (Allman braces, semicolons, single quotes, no leading blank lines, trailing newline at EOF).
2. **Run `npm run test`** — ensures all existing tests pass and new tests pass.
3. **Run `npm run build`** — ensures TypeScript compiles without errors and `.d.ts` files are generated correctly.
4. **Inspect the diff** — verify only intended files changed, no unintended reformatting.

### Linting Rules Specific to This Package

- **Allman brace style**: Opening braces on the next line.
- **Semicolons required** on every statement.
- **Single quotes** for strings; backticks for template literals with variables.
- **No leading blank lines** in files (custom `jitar/empty-first-line` rule).
- **One blank line** after import blocks.
- **One trailing blank line** at end of file.

---

## 5. Completion Criteria

An implementation is complete when:

1. **Type definitions** are updated in `src/types/ValidationScheme.ts` (if applicable).
2. **Validation logic** is implemented in `src/Validator.ts` (new case + private method).
3. **Public exports** are updated in `src/index.ts` (if a new type is exported).
4. **Test fixtures** are added in `test/fixtures/validationSchemes.fixture.ts` and `test/fixtures/values.fixture.ts`.
5. **Test cases** are added in `test/Validator.spec.ts` covering valid, invalid, and missing scenarios.
6. **`npm run lint`** passes with no errors.
7. **`npm run test`** passes — all existing and new tests succeed.
8. **`npm run build`** succeeds — TypeScript compiles without errors and `.d.ts` files are generated.

---

## Code Examples

### Established Implementation Patterns

**Private field declaration (top of class):**

```typescript
export default class Validator
{
    readonly #strict: boolean;

    public constructor(strict = true)
    {
        this.#strict = strict;
    }
```

**Private method with early return pattern:**

```typescript
#validateString(key: string, value: unknown, scheme: PrimitiveValidation, errors: string[]): void
{
    if (typeof value !== 'string')
    {
        errors.push(`Field '${key}' is not a string`);
    }
}
```

**Required-field check with early return:**

```typescript
if (value === undefined)
{
    if (scheme.required === true)
    {
        errors.push(`Field '${key}' is required`);
    }

    return;
}
```

**Switch dispatch on `type`:**

```typescript
switch (scheme.type)
{
    case 'string':
        return this.#validateString(key, value, scheme, errors);
    case 'integer':
        return this.#validateInteger(key, value, scheme, errors);
    // ... more cases
}
```

**Dot-notation key composition for nested errors:**

```typescript
#composeKey(parent: string, key: string): string
{
    return parent === '' ? key : `${parent}.${key}`;
}
```

**Export pattern in `src/index.ts`:**

```typescript
export { default as ValidationScheme } from './types/ValidationScheme';
export { default as ValidationResult } from './types/ValidationResult';
export { default as Validator } from './Validator';
```

### Patterns to Avoid

| Pattern | Why |
|---|---|
| Using `null` | The codebase uses `undefined` exclusively. |
| Inline type imports as separate statements | Use inline `import { type Foo }` instead of separate `import type` statements (monorepo convention). |
| Changing error message strings | Tests assert exact message strings. |
| Exposing additional public classes | Only `Validator` is public. |
| Using `null` for missing values | The codebase uses `undefined` exclusively. |
| Using `for...of` or `forEach` loops | The codebase uses `for...in` for list iteration (preserves index-based error messages). |
| Adding properties to `ValidationResult` | The shape `{ valid: boolean; errors: string[] }` is immutable. |
| Using relative paths across packages | Always use workspace aliases (`@jitar/...`). |
