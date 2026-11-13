---
name: code-review
description: Review code changes for bugs, regressions, security issues, convention drift, and missing tests in @jitar/validation. Use when reviewing a pull request or diff in this package.
---

# Code Review

## Overview

Reviews TypeScript changes within `@jitar/validation` for correctness, architectural integrity, and adherence to the conventions in the package [`AGENTS.md`](../../../AGENTS.md) and the monorepo root [`AGENTS.md`](../../../AGENTS.md).

## When to Use

Invoke this skill when asked to review a diff, pull request, or set of staged changes affecting any file under `packages/validation/`.

## Do Not Use For

- Reviewing changes outside this package (consult the relevant package's `AGENTS.md`).
- Implementation work (use the `implementation` skill).

---

## Review Workflow

### Step 1: Understand the Change

Before reviewing:

1. Identify the scope of the changes within the package.
2. Read the complete diff (use `github_pull_request_review_write` with `method: "get"` on the PR).
3. Understand the intended behavior from the commit message, PR description, or task.
4. Inspect the affected files relative to the package structure:

| Area | Relevant Files |
|---|---|
| Validation logic | `src/Validator.ts` |
| Type definitions | `src/types/ValidationScheme.ts`, `src/types/ValidationResult.ts` |
| Exports | `src/index.ts` |
| Tests | `test/Validator.spec.ts` |
| Test fixtures | `test/fixtures/validationSchemes.fixture.ts`, `test/fixtures/values.fixture.ts` |

5. Read surrounding code to understand existing behavior — never review changed lines in isolation.
6. Identify potential regressions, especially for error message strings and the default `strict` mode.

### Step 2: Correctness and Logic

Check for:

- Incorrect validation logic for any supported type (string, integer, real, boolean, url, group, list, enum).
- Missing conditions in the `#validateValue` switch dispatch (e.g., a new `FieldValidation` variant not handled).
- Incorrect handling of `undefined` values (the codebase uses `undefined` exclusively — never `null`).
- Incorrect boundary handling (e.g., empty arrays, empty objects, empty strings).
- Incorrect error propagation (errors must be collected, not silently swallowed).
- Incorrect state transitions in strict vs. lenient mode behavior.
- Incorrect nested validation (group recursion, list item iteration).
- Incorrect dot-notation key composition (e.g., `group.integer`, `list.0`).
- Unexpected side effects from mutation of the `errors` array.

### Step 3: TypeScript and Type Safety

Check for:

- Incorrect or overly broad types (e.g., using `any` instead of `unknown` for `value` parameters).
- Unsafe type assertions (e.g., unnecessary `as Record<string, unknown>` casts).
- Incorrect generic constraints on `FieldValidation` variants.
- Incorrect narrowing of `unknown` values before type checks.
- Incorrect optional property handling (e.g., not checking `scheme.required === true` before reporting required field errors).
- Public API type regressions (changes to exported types in `src/index.ts`).
- Type definitions that do not accurately represent runtime behavior (e.g., `ListValidation.items` is `PrimitiveValidation`, not `FieldValidation`).

### Step 4: Architecture and Design

Check for:

- Violations of the Validator's three-level dispatch architecture:
  ```
  validate(data, scheme)           → public entry point
    └─ #validateData(...)          → dispatches to keys + values
        ├─ #validateKeys(...)       → strict mode: unknown field check
        └─ #validateValues(...)    → iterates scheme keys, dispatches per-type
            └─ #validateValue(...)  → switch on scheme.type
  ```
- Incorrect placement of new validation logic (e.g., adding validation directly in `validate()` instead of adding a dedicated `#validate<Type>` method).
- Exposing additional public classes or methods without re-exporting through `src/index.ts`.
- Incorrect dependency direction (source files must not import from test files).
- Duplication of existing validation logic (e.g., reimplementing type checks that already exist in the Validator).
- Violations of the `private: true` constraint (this package is never published independently).

### Step 5: API and Compatibility

Check for:

- Breaking changes to exported types (`ValidationScheme`, `ValidationResult`).
- Changes to the `Validator` class constructor signature (default `strict = true` must be preserved).
- Changes to the `validate(data, scheme)` method signature or return type.
- Changes to error message strings (tests assert exact message strings — changing them breaks all tests).
- Changes to the default `strict` mode (it is `true` by design).
- Changes to the `FieldValidation` union type without updating the `#validateValue` switch dispatch.

### Step 6: Security and Reliability

Where relevant, inspect for:

- Input validation of untrusted data passed to `validate(data, scheme)`.
- Prototype pollution via constructed property names (e.g., `__proto__`, `constructor` in scheme keys).
- Path traversal through scheme field names used in dot-notation composition (e.g., `__proto__.polluted`).
- Unsafe deserialization (the `data` parameter accepts arbitrary `Record<string, unknown>`).
- Excessive memory usage from deeply nested group/list validation (unbounded recursion).
- Insecure defaults (e.g., changing `strict` default to `false`).

### Step 7: Performance

Look for meaningful performance problems, including:

- Unnecessary repeated computations (e.g., recomputing `Object.keys()` on every recursive call when not needed).
- Inefficient algorithms (e.g., `Array.prototype.includes()` in a loop inside `#validateKeys` — this is O(schemeKeys × dataKeys), consider using a `Set` for large schemes).
- Unbounded recursion through deeply nested groups or lists.
- Excessive string allocations from repeated `#composeKey()` calls on large datasets.

Do not report micro-optimizations without a meaningful impact.

### Step 8: Testing and Regression Coverage

Evaluate whether:

- New validation logic is accompanied by tests covering valid, invalid, and missing value scenarios.
- Existing tests cover modified behavior (especially error message strings).
- Important edge cases are tested (empty arrays, empty objects, deeply nested structures).
- Error scenarios are tested with exact message string assertions.
- The changes introduce behavior that existing tests do not protect against.

Do not automatically treat missing tests as a bug. Evaluate the risk and importance of the uncovered behavior.

### Step 9: Verify Findings

Before reporting a finding:

1. Locate the exact relevant code in the diff and surrounding context.
2. Understand the execution path through the Validator's dispatch chain.
3. Verify that the problem is actually possible at runtime.
4. Determine its impact on consumers of the package.
5. Check whether it is already handled elsewhere in the codebase.
6. Confirm that it is introduced by the reviewed changes or directly affected by them.

Never report hypothetical issues as confirmed defects.

---

## Finding Severity

Use the following severity levels:

### Critical
A severe defect that can cause major security compromise, data loss, or widespread system failure (e.g., prototype pollution through scheme keys, unbounded recursion causing stack overflow).

### High
A significant defect that causes incorrect behavior, serious regressions, security vulnerabilities, or substantial compatibility problems (e.g., breaking error message strings, changing default `strict` mode, missing switch case for a new `FieldValidation` variant).

### Medium
A meaningful defect that affects specific scenarios, edge cases, reliability, or maintainability in a way that warrants correction (e.g., performance issues with large schemes, unsafe type assertions, missing test coverage for edge cases).

### Low
A minor issue with limited impact that is still actionable (e.g., minor style deviations, unused imports, comments that contradict code).

### Informational
An observation or improvement suggestion that is not a confirmed defect.

Do not inflate severity. Explain the actual impact rather than relying on labels.

---

## Package-Specific Review Criteria

### Error Message Integrity

Error messages are exact strings asserted by tests. Any change to an error message is a breaking change that requires updating both the source and all corresponding test fixtures.

| Scenario | Message Format | Must Not Change |
|---|---|---|
| Missing required field | `Field '<key>' is required` | The word "required" and field name placement |
| Wrong primitive type | `Field '<key>' is not a <type>` | Type names: "string", "integer", "real number", "boolean" |
| Invalid URL | `Field '<key>' is not a valid URL` | Exact phrasing |
| Extra field (strict) | `Unknown field '<key>'` | The word "Unknown" and field name placement |
| Invalid list item | `Field '<listKey>.<index>' is not a <type>` | Dot-notation and type name |
| Invalid enum value | `Field '<key>' is not one of: <options>` | The "one of:" phrasing and comma-space separator |

### Validator Architecture

The Validator must maintain its three-level dispatch:

1. `validate(data, scheme)` — public entry, collects errors, returns `{ valid, errors }`.
2. `#validateData(key, data, scheme, errors)` — dispatches to `#validateKeys` (strict) + `#validateValues`.
3. `#validateValue(key, value, scheme, errors)` — switch on `scheme.type`, delegates to typed methods.

Adding a new validation type requires:
- Adding the type to `FieldValidation` union in `src/types/ValidationScheme.ts`.
- Adding a `case` branch in `#validateValue`.
- Implementing a dedicated `#validate<Type>` private method.
- Updating tests and fixtures.

### Private Field and Method Conventions

- Private fields use `#` syntax (e.g., `#strict`).
- Private methods use `#camelCase` (e.g., `#validateKeys`, `#composeKey`).
- Private fields are declared at the top of the class body.
- No additional public classes or methods should be exposed without re-exporting through `src/index.ts`.

### Type Safety

- `FieldValidation` is a discriminated union on `type`.
- `ListValidation.items` is `PrimitiveValidation` (not `FieldValidation`) — list items cannot be nested groups or lists.
- `data` parameter is `Record<string, unknown>` — always check before type-specific validation.
- The `required` property is optional (`boolean | undefined`) — always check `scheme.required === true` explicitly.

### Code Style (Enforced by ESLint)

- Semicolons required on every statement.
- Allman brace style (`brace-style: ["error", "allman"]` with `allowSingleLine: true`).
- One leading blank line at the top of every file (`jitar/empty-first-line: "error"`).
- One blank line after import blocks.
- One trailing blank line at end of file (`eol-last: "error"`).
- Single quotes for strings; backticks for template literals with variables.
- Inline type imports (`import { type Foo }`), not separate `import type` statements.

### Package Boundaries

- This package is `private: true` — never published independently.
- The `@jitar/errors` dependency is declared but unused in source code — flag unused dependencies.
- All intra-monorepo imports must use workspace aliases (`@jitar/...`), never relative paths across packages.
- Every public class and type must be re-exported via `src/index.ts`.

---

## Review Findings Format

Every finding must include:

- **Severity** (Critical, High, Medium, Low, Informational).
- A **concise title**.
- **Exact file and line reference**.
- **Description** of the problem (what it is and why it occurs).
- **Impact** (when and how this affects the application or package).
- **Suggested fix** (direction for correcting, without prescribing an entire implementation).

Example:

[SEVERITY] Short description

File: `src/Validator.ts:123`

Problem:
Explain the specific defect.

Impact:
Explain when and how this affects the application or package.

Suggested fix:
Describe the necessary correction without unnecessarily prescribing an entire implementation.

---

## Review Output Structure

### Findings

List findings ordered by severity, highest first.

### Areas Reviewed

Briefly identify the main areas examined (e.g., "Validator.ts validation dispatch", "ValidationScheme type definitions", "Test coverage").

### Testing and Verification

Report:
- Checks actually executed (lint, tests, build).
- Checks that could not be executed (e.g., CI environment unavailable).
- Any relevant verification limitations.

### Overall Assessment

Choose one:

- **Changes requested:** At least one meaningful issue should be fixed before merging.
- **Approved:** No actionable issues were identified within the reviewed scope.
- **Inconclusive:** The review could not establish correctness because of missing context or verification limitations.

Do not claim approval merely because no issues were immediately obvious.

---

## Important Restrictions

- Do not modify source files.
- Do not automatically fix identified issues.
- Do not generate commits.
- Do not change configuration.
- Do not report style preferences as defects (unless they violate ESLint rules).
- Do not duplicate findings.
- Do not report issues unrelated to the changes unless they are directly relevant to the review.
- Do not claim to have executed tests or commands that were not executed.
- Clearly distinguish confirmed defects from informational suggestions.