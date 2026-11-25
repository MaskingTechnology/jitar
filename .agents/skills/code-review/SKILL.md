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

### Model / domain class design

When reviewing domain or model classes (classes that represent data or parsed structures):

- [ ] Every model class provides a `clone()` method that returns a deep copy of the instance
- [ ] Every model class provides a `toString()` method that returns a string representation of the object
- [ ] Private fields and methods use the `#` prefix (not the `private` keyword)
- [ ] Read-only accessors are `public readonly` properties; computed or filtered accessors use getter properties rather than exposing raw collections
- [ ] Constructor parameters are assigned directly in the constructor body — no intermediate variable mutations or post-constructor property wiring

### API surface & method naming

When reviewing public APIs (tools, services, reflectors, parsers, etc.):

- [ ] Public methods follow a consistent naming convention: `parse*` for parsing, `from*` for construction from runtime values, `is*` for type checks, `get*` / `has*` for member lookup
- [ ] Factory-style methods that construct objects from runtime values use a `from*` prefix (e.g., `fromClass`, `fromObject`, `fromModule`)
- [ ] Boolean query methods use the `is*` or `has*` prefix (e.g., `isClass`, `hasMember`, `canRead`)

### Index files & export patterns

When reviewing `index.ts` files or package entry points:

- [ ] Index files re-export using explicit named syntax (`export { default as ClassName } from './ClassName'`) rather than bare default re-exports
- [ ] Type re-exports use `export type` with custom name aliases when the exported type name would clash with another export (e.g., `export type { Visibility as ClassVisibility }`)
- [ ] Related exports are grouped logically in the main entry point (e.g., models together, tools together)
- [ ] Internal implementation details (helper types, error internals, definition constants) are not re-exported through the public API

### Error handling

When reviewing custom error classes or error-throwing code:

- [ ] Error classes extend `Error` directly (not custom base classes) and use `export default class`
- [ ] Error names are prefixed descriptively (e.g., `Expected*`, `Unexpected*`)
- [ ] Error messages include contextual information (position, value, or identifier) to aid debugging
- [ ] Errors are thrown with explicit custom classes rather than `throw new Error()` strings

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
- [ ] Shared instances (parsers, reflectors, etc.) are created once at the top of the `describe` block, not per-test
- [ ] Assertions verify both the instance type (`toBeInstanceOf`) and property values (`toEqual`, `toHaveLength`)