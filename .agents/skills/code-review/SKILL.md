---
name: code-review
description: Review a pull request, branch, or diff that changes packages under `packages/*` for bugs, regressions, security issues, convention drift, and missing tests. Use when asked to review changes in the Jitar codebase.
---

# Code Review

## Overview

A review checks a change in two ways:

1. **Correctness**: does the change do what it intends, without breaking callers, other packages or the published `jitar` package?
2. **Conventions**: does it follow [`CODING_STANDARDS.md`](../../../CODING_STANDARDS.md), the [`implementation`](../implementation/SKILL.md) skill for source code and the [`write-test`](../write-test/SKILL.md) skill for tests?

Those documents are the source of truth for conventions. This skill does not repeat them in full. It lists what to check and the mistakes that are easy to miss. When this skill and those documents disagree, follow the documents and mention the conflict.

Also read the `AGENTS.md` of every changed package. It holds package-specific rules (for example, the serializer registration order in `serialization`) and the list of public exports.

## Workflow

1. **Collect the change.** Get the diff against the base branch (usually `main`), e.g. `git diff main...HEAD`, or the pull request diff. List the changed packages and the kind of change: feature, fix, refactor, tests, or docs.
2. **Read the context.** Read the changed files in full, not only the diff hunks, plus the `AGENTS.md` of each changed package. For a public API change, find the callers in other packages (`grep -rn "<Name>" packages/*/src`).
3. **Check correctness** with the checklist below. This is the most important part of the review.
4. **Check conventions** with the checklist below.
5. **Check tests and docs.** Is the new or changed behavior covered? Is the package's `AGENTS.md` still accurate?
6. **Verify** when you can: `npm run build:all`, `npm run test` and `npm run lint` from the repository root. Report failures with their output.
7. **Report** the findings (see [Reporting](#reporting)).

Do not report something as a problem unless you checked it in the code. When you are not sure, say so and explain what would confirm it.

## Correctness Checklist

### Behavior

- [ ] The change does what the description or issue asks, including edge cases (empty collections, `undefined`, missing optional configuration)
- [ ] Every `async` call is awaited or deliberately returned; there are no floating promises and no `forEach` with `async` callbacks
- [ ] Independent async work runs in parallel with `Promise.all`; dependent work is not parallelized by mistake
- [ ] Errors are not swallowed. A `catch` either handles the error meaningfully, converts it (e.g. to a `Response` via `ErrorConverter`), or rethrows it, wrapped with `{ cause }` where appropriate
- [ ] Objects and arrays received from callers are not mutated; internal collections are not returned directly
- [ ] Defaults are applied with `??`, not `||`, so `0`, `''` and `false` remain valid values

### Lifecycle and state

- [ ] Components with `start` / `stop` start and stop everything they own, and leave a consistent state when a step fails
- [ ] State transitions use the `States` definitions, and `start` / `stop` are safe to call twice where the component tracks state (see `MiddlewareManager`, `StateManager`)
- [ ] Scheduled tasks, timers and servers that are started are also stopped

### Errors and status codes

- [ ] Errors that can reach the caller of a procedure extend the right base from `@jitar/errors`. The base class decides the HTTP status code through `ErrorConverter`, so a wrong base means a wrong status code
- [ ] Internal and lifecycle errors extend `Error`, and wrapping errors pass the original as `cause`
- [ ] A specific error class is thrown, never `new Error('...')` or a string

### Package boundaries and public API

- [ ] Removed or renamed exports from a package's `src/index.ts` are not used by other packages or by the `jitar` umbrella (`packages/jitar/src/lib.ts`, `client.ts`)
- [ ] New members that Jitar users need are exported from the umbrella package; internals are not exported
- [ ] Code reachable from `packages/jitar/src/client.ts` does not use Node.js built-ins (it is bundled for the browser)
- [ ] A new third-party runtime dependency is also listed in the `dependencies` of `packages/jitar/package.json` and in `SERVER_EXTERNALS` (`packages/jitar/rollup.definitions.js`)
- [ ] New `@jitar/*` dependencies are declared in `package.json` and do not create a cycle or make a low-level package depend on a high-level one
- [ ] Package-specific rules from `AGENTS.md` are respected (e.g. serializer order in `SerializerBuilder`, conditional registration of platform features)

### Security

- [ ] Data from requests, files, environment variables and configuration is validated before use (`@jitar/validation` where the package already uses it)
- [ ] File paths built from external input cannot escape their root directory (compare the `InvalidLocation` check in `sourcing/src/files/FileManager.ts`)
- [ ] Trust checks (such as the trust key in `LocalWorker`) and access levels (`public`, `protected`, `private`) are not bypassed or weakened
- [ ] No secrets, tokens or credentials are logged, hard-coded or returned in errors or responses
- [ ] Deserialization does not resolve arbitrary classes or execute code from untrusted input

## Conventions Checklist

Check these against the `implementation` skill and `CODING_STANDARDS.md`:

### Structure

- [ ] One component per file, file name equal to the default export, in the right folder (`definitions/`, `errors/`, `interfaces/`, `models/`, `types/`, `utils/`) or following the package's existing sub-module structure
- [ ] Classes, interfaces, types and constant objects use `export default`; index files re-export with `export { default as <Name> }` and `type` for type-only exports
- [ ] The package's `src/index.ts` exports exactly the public members, and its `AGENTS.md` lists them

### Classes and types

- [ ] Private members use `#name`, never the `private` / `protected` keywords
- [ ] Fields are declared at the top of the class and are `readonly` when not reassigned
- [ ] Public state is exposed through single-line getters without a return type; methods always declare their return type
- [ ] Collaborators are passed through the constructor; constructors with many parameters take a `configuration` object with a file-local `type Configuration`
- [ ] Constants are `as const` objects with `UPPER_SNAKE_CASE` keys and a derived union type, used instead of raw string values
- [ ] `unknown` with narrowing instead of `any`; `as` assertions only after a check (or for the `default` export of a dynamically imported module)
- [ ] `undefined` is used, not `null` (unless a library requires it)

### Errors

- [ ] Error classes are named after the situation without an `Error` suffix and live in an `errors/` folder near the code that throws them
- [ ] Data the caller needs is stored in `#private` fields with getters; no other properties are added. Setting `this.name` is not required; it is fine where the package's other errors do it
- [ ] Messages are in present tense, wrap named values in single quotes, and use singular subjects for rules

### Imports and style

- [ ] Import blocks are ordered external, `@jitar/*`, relative, types, and sorted alphabetically within a block
- [ ] Type-only imports use `import type`
- [ ] No relative imports across `packages/`
- [ ] File starts with one empty line and ends with a newline; Allman braces; semicolons; 4-space indent; single quotes; template strings instead of concatenation
- [ ] Braces on every `if`, `else` and loop; explicit comparisons (`=== undefined`, `=== false`) instead of truthiness and `!`
- [ ] No `eslint-disable` comments without approval, except `@typescript-eslint/no-unused-vars` for a parameter an interface requires
- [ ] No leftover debug output. `console.*` is only used for intended CLI output (`packages/cli/src/commands`); other packages use `@jitar/logging`
- [ ] Comments use `//`, are rare and explain *why*

## Tests Checklist

Check these against the `write-test` skill:

- [ ] New and changed public behavior has tests, including error cases, in `test/<mirrored path>/<Name>.spec.ts`
- [ ] Spec files contain scenarios and assertions only; instances, inputs and expected outputs live in `fixtures/` and are re-exported from `fixtures/index.ts`
- [ ] Naming: folder-prefixed component name, `.member(params)`, `should ...`
- [ ] Errors are asserted as exact instances (`rejects.toEqual(new X(...))`, `toThrow(new X(...))`)
- [ ] Test doubles are handwritten classes in fixtures; no `vi.fn()` or `vi.mock()`
- [ ] Assertions were not weakened and tests were not removed to make the suite pass

## Documentation

- [ ] The package's `AGENTS.md` matches the change: exports, dependencies, structure, errors and architecture decisions
- [ ] A user-facing change to the `jitar` package or a plugin is reflected in its `README.md` or the documentation, when relevant

## Reporting

Report each finding with:

- **Location**: `packages/<package>/src/<file>.ts:<line>`
- **Severity**:
  - **Blocking**: a bug, regression, security issue, broken build or failing test
  - **Should fix**: a convention violation, missing test, or outdated `AGENTS.md`
  - **Nit**: a minor style or naming suggestion
- **Problem**: what is wrong and, for bugs, the concrete scenario that fails
- **Suggestion**: how to fix it, with a short code example when it helps

Order the findings by severity, blocking first. End with a short summary: the overall verdict, what was verified (build, tests, lint), and what was not. If there are no findings, say so explicitly.
