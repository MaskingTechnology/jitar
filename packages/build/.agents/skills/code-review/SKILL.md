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