---
name: code-review
description: Review code changes for bugs, regressions, security issues, convention drift, and missing tests. Use when reviewing a pull request or diff in the Jitar codebase.
---

# Code Review

## Overview

Reviews TypeScript changes across Jitar's packages (`packages/*`) for correctness, architectural integrity, and adherence to the conventions in the repository root [`AGENTS.md`](../../../AGENTS.md).

## When to Use

Invoke this skill when asked to review a diff, pull request, or set of staged changes.

## Review Checklist

### TypeScript & formatting

- [ ] TypeScript strict mode compliance — no unjustified `any` (prefer `unknown` with narrowing); no new `as` assertions where a type guard would do
- [ ] Single quotes, semicolons on every statement, Allman brace style (see `AGENTS.md` → Code Style)
- [ ] One leading blank line at the top of the file, one blank line after the import block, one trailing blank line at EOF
- [ ] Inline type imports (`import { type Foo } from 'bar'`) rather than a separate `import type` statement
- [ ] No unused variables/imports, no stray `console.*` calls (use the shared `logger`)

### File organization

When reviewing package source structure:

- [ ] One file per logical component (class, interface, or type) — no multiple unrelated classes in a single file
- [ ] Interfaces live under `src/interfaces/`, error classes under `src/errors/`, shared types under `src/types/`, and definition constants under `src/definitions/`
- [ ] Sub-modules have their own `index.ts` that re-exports their public members

### Class & interface naming

When reviewing class and interface names:

- [ ] Class names use `PascalCase` (e.g., `FileManager`, `SourcingManager`)
- [ ] Interface names use `PascalCase` without an `I` prefix (e.g., `FileReader`, `FileSystem`)
- [ ] Private fields and methods use the `#` prefix with `camelCase` naming (e.g., `#validateLocation`, `#rootLocation`)
- [ ] Private fields are declared at the top of the class body

### Class design & initialization

When reviewing class implementations:

- [ ] All class fields use the `#` private field prefix — never the `private` keyword
- [ ] Public field access is provided via getters (e.g., `get name() { return this.#name; }`)
- [ ] Constructor-based initialization only — no default values in property declarations, no post-constructor property wiring
- [ ] Builder or fluent methods that mutate state return `this` for method chaining

### Model / domain class design

When reviewing domain or model classes (classes that represent data or parsed structures):

- [ ] Every model class provides a `clone()` method that returns a deep copy of the instance
- [ ] Every model class provides a `toString()` method that returns a string representation of the object
- [ ] Read-only accessors are `public readonly` properties; computed or filtered accessors use getter properties rather than exposing raw collections

### API surface & method naming

When reviewing public APIs:

- [ ] Public methods follow a consistent naming convention: `parse*` for parsing, `from*` for construction from runtime values, `is*` for type checks, `get*` / `has*` for member lookup
- [ ] Factory-style methods that construct objects from runtime values use a `from*` prefix (e.g., `fromClass`, `fromObject`, `fromModule`)
- [ ] Boolean query methods use the `is*` or `has*` prefix (e.g., `isClass`, `hasMember`, `canRead`)

### Index files & export patterns

When reviewing `index.ts` files or package entry points:

- [ ] Index files re-export using explicit named syntax (`export { default as ClassName } from './ClassName'`) rather than bare default re-exports
- [ ] Type re-exports use `export type` with custom name aliases when the exported type name would clash with another export (e.g., `export type { Visibility as ClassVisibility }`)
- [ ] Related exports are grouped logically in the main entry point
- [ ] Internal implementation details (helper types, error internals, definition constants) are not re-exported through the public API

### Error handling

When reviewing custom error classes or error-throwing code:

- [ ] Error classes extend base error types from `@jitar/errors` (not `Error` directly) when an appropriate base exists (e.g., `NotFound`, `BadRequest`)
- [ ] Error classes use `export default class` syntax
- [ ] Error classes set `this.name` to the class name in the constructor
- [ ] Error classes use `#` private field prefix for error-specific data and provide getters for access
- [ ] Error names are descriptive (e.g., `NoSerializerFound`, `ClassNotFound`, `InvalidClass`)
- [ ] Error messages include contextual information (type, name, value, or identifier) to aid debugging
- [ ] Errors are thrown with explicit custom classes rather than `throw new Error()` strings
- [ ] Component-specific errors live in a nested `errors/` directory (e.g., `src/serializers/errors/`)

### Constants & enum patterns

When reviewing constant definitions:

- [ ] Constants are defined as `const` objects with `UPPER_SNAKE_CASE` keys and `as const` assertion (e.g., `AccessLevels`, `RunModes`)
- [ ] Derived types are created via `typeof` (e.g., `type AccessLevel = typeof AccessLevels[keyof typeof AccessLevels]`)
- [ ] Constants live under `src/definitions/`

### Abstract base class & extension patterns

When reviewing abstract base classes and their concrete implementations:

- [ ] Abstract base classes define the contract via abstract methods
- [ ] Concrete implementations extend the abstract base and implement all required abstract methods
- [ ] Base classes provide helper methods that delegate to parent/context objects
- [ ] Matching/dispatch logic uses `can*` methods to determine applicability before calling the main operation
- [ ] All I/O or processing methods are `async` and return `Promise<unknown>`

### Builder / factory patterns

When reviewing builder or factory classes:

- [ ] Builder classes provide static factory methods (e.g., `build()`) to construct complex objects
- [ ] Builder methods accept optional dependencies (e.g., `Resolver?`) to enable conditional feature registration
- [ ] Components are registered in priority order — most specific first, most generic last
- [ ] Conditional registration is used for platform-dependent features (e.g., `Buffer` only when available)

### Type definitions

When reviewing type definitions:

- [ ] Base types are defined in `src/types/`
- [ ] Specialized types extend base types via intersection types (e.g., `type X = Base & { additional: ... }`)
- [ ] Types live under `src/types/` (with specialized sub-types under `src/types/<category>/` when appropriate)
- [ ] Types are exported as default exports (`export default TypeName`)

### Import conventions

When reviewing import statements across the monorepo:

- [ ] Within a single package, sibling modules are imported via relative paths (e.g., `../model`, `../../src/static`) — not workspace aliases
- [ ] Cross-package imports use workspace aliases (`@jitar/...`) — never relative paths crossing `packages/` boundaries
- [ ] Type-only imports use `import type` to avoid runtime overhead

### Test conventions

When reviewing test files (`*.spec.ts`) or test fixtures (`*.fixture.ts`):

- [ ] Test files are named `*.spec.ts`; fixture files are named `*.fixture.ts`
- [ ] Fixtures export named constants (e.g., `export const CLASSES = { ... }`) rather than default exports
- [ ] Tests use `describe('ClassName')` for class-level grouping and `describe('.methodName(params)')` for method-level grouping
- [ ] Individual tests use `it('should <behavior>')` phrasing
- [ ] Shared instances are created once at the top of the `describe` block, not per-test
- [ ] Assertions verify both the instance type (`toBeInstanceOf`) and property values (`toEqual`, `toHaveLength`)
- [ ] Test fixtures live in `test/<component>/fixtures/` with an index re-exporting all fixtures
- [ ] Tests cover: successful round-trip, matching logic, and error handling for invalid input