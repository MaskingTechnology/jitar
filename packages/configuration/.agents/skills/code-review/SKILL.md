---
name: code-review
description: Review code changes for bugs, regressions, security issues, convention drift, and missing tests. Use when reviewing a pull request or diff in the @jitar/analysis package.
disabled: true
---

# Code Review

## Overview

Reviews TypeScript changes for correctness, architectural integrity, and adherence to the conventions in the package [`AGENTS.md`](../../../AGENTS.md), and that of the root [`AGENTS.md`](../../../../../AGENTS.md).

## When to Use

Invoke this skill when asked to review a diff, pull request, or set of staged changes.

## Review Checklist

### Formatting & TypeScript

- [ ] TypeScript strict mode — no unjustified `any` (prefer `unknown` with narrowing); no new `as` assertions where a type guard would do
- [ ] Linting passes — semicolons, Allman braces, no inline rule disables, no leading blank lines (see root `AGENTS.md` → Linting)
- [ ] No unused variables/imports, no stray `console.*` calls (use the shared `logger`)

### Correctness & Regressions

- [ ] Logic correctness — no off-by-one, null/undefined guards, correct async error handling
- [ ] No breaking API changes — public method signatures, return types, and visibility modifiers unchanged
- [ ] Error classes carry descriptive messages with position information (see `AGENTS.md` → Error Handling)

### Package-Specific Conventions

- [ ] Model classes: `export default class`, `clone()` returns deep copy, `toString()` with optional `terminate` boolean, `#` for private fields
- [ ] Naming: `ES` prefix on all model classes; error names prefixed `Expected`/`Unexpected`
- [ ] Exports: re-export via `index.ts` using `export { default as Name } from './Name'`
- [ ] Imports: workspace aliases (`@jitar/...`) across packages, relative paths within a package

### Tests

- [ ] New/changed logic has corresponding `*.spec.ts` in matching `test/<category>/` directory
- [ ] Tests use `describe('ClassName')` and `it('should <behavior>')` patterns (see `AGENTS.md` → Writing Tests)
- [ ] Fixtures imported from `./fixtures`, assertions cover both type (`toBeInstanceOf`) and values

### Security

- [ ] No hardcoded secrets, API keys, or credentials
- [ ] User input is validated/sanitized before processing (parser input)
- [ ] No eval-like patterns or untrusted code execution