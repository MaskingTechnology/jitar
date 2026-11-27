---
name: implementation
description: Implement or change source code (`src/**/*.ts`) in a package under `packages/*`. Use when adding a feature, class, error, definition or export, refactoring existing code, or adding a dependency between packages, so the result follows the Jitar architecture and coding conventions.
---

# Implementation

## Overview

Jitar is a monorepo of small TypeScript packages. All packages except `jitar` and `@jitar/plugin-vite` are **private**: they are never published on their own, but are bundled into the `jitar` umbrella package. Every package follows the same layout and the same class-based style.

The general rules are in [`CODING_STANDARDS.md`](../../../CODING_STANDARDS.md). This skill describes how those rules are applied across the packages. Before changing a package, also read its own `AGENTS.md` (`packages/<package>/AGENTS.md`). It lists the public exports, the dependencies, the architecture decisions and package-specific rules (for example, how to register a new serializer in `serialization`).

Good reference code:

| Pattern | Example |
| --- | --- |
| Manager with lifecycle (`start` / `stop`) | `packages/execution/src/ExecutionManager.ts`, `packages/middleware/src/MiddlewareManager.ts` |
| Shared state handling for services | `packages/services/src/common/StateManager.ts`, `packages/services/src/worker/LocalWorker.ts` |
| Model with getters and chaining | `packages/execution/src/models/Segment.ts` |
| Constants with a derived type | `packages/execution/src/definitions/RunModes.ts`, `packages/middleware/src/definitions/States.ts` |
| Configuration object in the constructor | `packages/services/src/worker/LocalWorker.ts` |
| Builder | `packages/services/src/worker/RemoteWorkerBuilder.ts`, `packages/serialization/src/SerializerBuilder.ts` |
| Abstract base with `can*` dispatch | `packages/serialization/src/ValueSerializer.ts` |
| Errors that carry data | `packages/execution/src/errors/ProcedureNotFound.ts` |
| Errors that wrap a cause | `packages/execution/src/errors/StartingExecutionManagerFailed.ts` |
| Sub-modules with their own index | `packages/configuration/src/`, `packages/sourcing/src/` |

## Package Layout

Every package has the same files:

```
packages/<package>/
  AGENTS.md            ← package-specific instructions (keep it up to date)
  package.json
  tsconfig.json        ← extends ../../tsconfig.json (rootDir ./src, outDir ./dist)
  vitest.config.ts     ← when the package has tests
  src/
    index.ts           ← the only public entry point
  test/
```

`package.json` uses `"type": "module"`, `"exports": "./dist/index.js"`, `"types": "dist/index.d.ts"` and the scripts `test`, `test-coverage`, `lint` (`eslint`), `build` (`tsc -p tsconfig.json`) and `clean`. Copy the shape from an existing private package such as `packages/execution/package.json` when you create a new one.

### Folders inside `src/`

Group files by kind, within the package root or within a sub-module:

| Folder | Contains | Example |
| --- | --- | --- |
| `definitions/` | `as const` objects and their derived types | `RunModes.ts`, `StatusCodes.ts`, `Defaults.ts` |
| `errors/` | One error class per file, close to the code that throws it | `ProcedureNotFound.ts` |
| `interfaces/` | Interfaces | `Runner.ts`, `Middleware.ts` |
| `models/` | Domain models | `Segment.ts`, `Request.ts` |
| `types/` | Shared type aliases | `NextHandler.ts`, `Serialized.ts` |
| `utils/` | Helper classes | `VersionParser.ts`, `ErrorConverter.ts` |

The main component of the package (for example `ExecutionManager`, `MiddlewareManager`) lives at the root of `src/`.

Larger packages split `src/` into **sub-modules** per feature (`configuration/src/runtime/`, `services/src/worker/`, `analysis/src/static/`). A sub-module may have its own `errors/` and `definitions/` folders. In `services`, the interface of a feature lives next to its implementations (`worker/Worker.ts`, `worker/LocalWorker.ts`, `worker/RemoteWorker.ts`). Follow the structure that the package already uses rather than introducing a new one.

### Files

- One logical component per file: a class, interface, type, error or definition.
- The file name equals the name of its default export: `FileManager.ts` contains `FileManager`.
- A small helper type that only one file uses (such as `type Configuration` in `LocalWorker.ts`) stays in that file and is not exported.

## Exports

### Default exports

Classes, interfaces, types and constant objects are exported as `default`:

```ts
export default class Segment
{
    ...
}
```

Interfaces and types are declared first and exported at the end of the file:

```ts

import type { State } from './common/definitions/States';

interface Service
{
    get url(): string;

    get state(): State;

    start(): Promise<void>;

    stop(): Promise<void>;
}

export default Service;
```

### Index files

`src/index.ts` is the only public entry point of a package. Re-export every public member with the `export { default as <Name> }` pattern, grouped by folder with a blank line between groups:

```ts

export { default as RunModes, type RunMode } from './definitions/RunModes';
export { default as StatusCodes } from './definitions/StatusCodes';

export { default as ProcedureNotFound } from './errors/ProcedureNotFound';

export { default as Runner } from './interfaces/Runner';

export { default as Segment } from './models/Segment';

export { default as ExecutionManager } from './ExecutionManager';
```

- Use `type` for type-only exports (`type RunMode`, `export type { ... }`).
- Only export what another package needs. Internal models, helper types and errors that never leave the package stay unexported. The package's `AGENTS.md` lists what is exported and what is internal; update it when you change the public surface.
- When a package uses sub-modules with their own `index.ts`, the package index re-exports from those.

### The `jitar` umbrella package

The `jitar` package (`packages/jitar/src/`) does not implement anything. It re-exports selected members of the internal packages and bundles them with Rollup:

| Entry | Purpose |
| --- | --- |
| `lib.ts` | Server-side API (`jitar`) |
| `client.ts` | Browser-safe client API (`jitar/client`), bundled for the browser |
| `cli.ts` | The `jitar` command |

When a new member must be available to Jitar users, export it from the internal package first and then add it to the right umbrella entry. Anything reachable from `client.ts` must not depend on Node.js built-ins. A new third-party runtime dependency of an internal package must also be added to the `dependencies` of `packages/jitar/package.json` and to `SERVER_EXTERNALS` in `packages/jitar/rollup.definitions.js`, so it is installed with `jitar` instead of being bundled.

## Dependencies Between Packages

- Import other packages through their workspace alias (`@jitar/execution`). Never use a relative path into another package.
- Declare the dependency in the package's `package.json` as `"@jitar/<name>": "*"`.
- Respect the dependency direction. Low-level packages (`errors`, `sourcing`, `analysis`, `logging`, `validation`) depend on nothing or very little; `execution`, `serialization`, `health`, `scheduling` and `middleware` build on them; `services`, `runtime`, `http`, `build` and `cli` sit on top. Never add a dependency that creates a cycle, and prefer moving shared code down over pulling a high-level package into a low-level one.
- Update the Dependencies table in the package's `AGENTS.md`.

Turbo builds packages in dependency order. A package resolves its `@jitar/*` dependencies from their `dist/`, so run `npm run build:all` after changing a package that others depend on.

## Classes

### Structure

```ts

import type { ModuleImporter } from '@jitar/sourcing';

import States from './definitions/States';
import type { State } from './definitions/States';

import InvalidMiddleware from './errors/InvalidMiddleware';

import type Middleware from './interfaces/Middleware';

export default class MiddlewareManager
{
    #state: State = States.STOPPED;
    #middlewares: Middleware[] = [];

    readonly #moduleImporter: ModuleImporter;
    readonly #middlewareFiles: string[];

    constructor(moduleImporter: ModuleImporter, middlewareFiles: string[] = [])
    {
        this.#moduleImporter = moduleImporter;
        this.#middlewareFiles = middlewareFiles;
    }

    get state() { return this.#state; }

    addMiddleware(middleware: Middleware): void
    {
        ...
    }

    async #loadMiddleware(filename: string): Promise<Middleware>
    {
        ...
    }
}
```

The order inside a file is:

1. Imports.
2. Module-level constants (`const DEFAULT_INTERVAL = 5000;`, `const JITAR_TRUST_HEADER_KEY = '...';`) and file-local types (`type Configuration = { ... };`).
3. The class: private fields, constructor, getters (and setters), public methods, private methods.

Rules:

- Use `export default class`. Never use the `private` or `protected` keywords: private members use JavaScript private syntax (`#name`, `#loadMiddleware()`).
- Declare all fields at the top of the class. Mark them `readonly` when they are not reassigned. Fields with a fixed initial value (a `new Map()`, `States.STOPPED`, an internal helper) may be initialized at the declaration; everything else is set in the constructor.
- Expose fields through getters on a single line: `get name() { return this.#name; }`. Getters do not declare a return type.
- Methods always declare their return type, including `void` and `Promise<void>`.
- Methods that add to a model and are used for building it return `this`, so calls can be chained (`segment.addProcedure(...).addProcedure(...)`).
- Return copies of internal collections (`[...this.#classes.values()]`), never the collection itself.

### Dependencies and configuration

- Receive collaborators through the constructor. Do not create them inside methods. Small internal helpers without dependencies (such as `new ArgumentConstructor()` in `ExecutionManager`) are the exception.
- With up to about three parameters, use positional parameters with defaults: `constructor(moduleImporter: ModuleImporter, segmentFiles: string[] = [])`.
- With more parameters, accept a single `configuration` object described by a file-local `type Configuration`, as `LocalWorker` and `LocalGateway` do. Required fields are plain, optional fields use `?`.
- Apply defaults with `??` and constants: `configuration.port ?? Defaults.PORT_NUMBER`. Shared default values go in `definitions/Defaults.ts`, values used by one file go in a `DEFAULT_*` module constant.
- Use `undefined`, not `null`, for missing values.

### Lifecycle

Components that load resources or run background work implement `start(): Promise<void>` and `stop(): Promise<void>`:

- Wrap the work in `try` / `catch` and rethrow a `Starting<Component>Failed` / `Stopping<Component>Failed` error that passes the original error as `cause` (see `ExecutionManager`).
- When the component tracks its state, use the `States` definition and make `start` and `stop` safe to call twice (see `MiddlewareManager`). Services in `@jitar/services` delegate this to `StateManager.start(task)` / `StateManager.stop(task)`.
- A composite component starts its dependencies in `start` and stops them in `stop`, in parallel with `Promise.all` when they are independent.

### Recurring patterns

| Pattern | Naming | Notes |
| --- | --- | --- |
| Coordinator | `*Manager` (`ExecutionManager`, `HealthManager`, `SourcingManager`) | Owns a collection or a process and delegates to helpers |
| Builder | `*Builder` with a `build(...)` method (`SerializerBuilder`, `RemoteWorkerBuilder`, `ClientBuilder`) | Holds shared dependencies, creates configured instances |
| Local / remote pair | `Local*` and `Remote*` implementing one interface (`LocalWorker`, `RemoteWorker`) | Remote variants talk to a `Remote` from `@jitar/services` |
| Strategy dispatch | Abstract base with `can*` + action methods (`ValueSerializer`) | The dispatcher asks each strategy `canX(value)` before calling `x(value)` |
| Placeholder | `Dummy*` (`DummyRunner`) or a class whose methods throw `NotImplemented` | Makes an unsupported option explicit; document it in `AGENTS.md` |

Method names follow the same verbs everywhere: `get*` / `has*` / `add*` / `clear*` for collections, `is*` / `can*` for boolean checks, `load*` for reading from files or modules, `build` for builders, `parse*` for parsers.

## Definitions

Constants are `as const` objects with `UPPER_SNAKE_CASE` keys. Derive the union type from the object and export both:

```ts

const RunModes =
{
    NORMAL: 'normal',
    DRY: 'dry'
} as const;

type RunMode = typeof RunModes[keyof typeof RunModes];

export default RunModes;
export type { RunMode };
```

Use the constants in code (`RunModes.DRY`), never the raw string values. Use the derived type for fields and parameters (`#state: State`).

## Types

- Use `type` aliases for object types and unions. Name them in `PascalCase` and default-export them.
- Configuration types have `readonly` (mostly optional) fields.
- Extend a base type with an intersection: `type SerializedMap = Serialized & { entries: ... };`.
- For unions with variants, give each variant a common discriminant property (`type: 'string' | 'integer'`).
- Avoid `any`. Use `unknown` and narrow it with checks such as `instanceof`, `typeof` or `=== undefined`. Only use an `as` assertion after such a check, or for the `default` export of a dynamically imported module.

## Errors

Every error is a default-exported class in its own file in an `errors/` folder, close to the code that throws it. Name it after the situation, without an `Error` suffix: `ProcedureNotFound`, `InvalidSegment`, `StartingServerFailed`.

| Situation | Base class | Example |
| --- | --- | --- |
| The error can reach the caller of a procedure | The matching base from `@jitar/errors` (`BadRequest`, `Unauthorized`, `Forbidden`, `NotFound`, `ServerError`, ...) | `ProcedureNotFound extends NotFound` |
| Internal or lifecycle error | `Error` | `StartingExecutionManagerFailed extends Error` |

The base class decides the status code (see `ErrorConverter` in `execution`), so pick it carefully.

An error that carries data the caller needs stores it in a private field and exposes it through a getter:

```ts

import { NotFound } from '@jitar/errors';

export default class ProcedureNotFound extends NotFound
{
    readonly #fqn: string;

    constructor(fqn: string)
    {
        super(`Procedure '${fqn}' not found`);

        this.#fqn = fqn;
    }

    get fqn() { return this.#fqn; }
}
```

An error that wraps another error passes it as `cause`:

```ts

export default class StartingExecutionManagerFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Starting execution manager failed', { cause });
    }
}
```

- Some older errors also set `this.name`. Keep doing so in a package where the surrounding errors do, for consistency, but do not add other properties unless the caller needs them.
- Always throw a specific error class. Never `throw new Error('...')` or throw a string.
- Messages are in present tense, wrap named values in single quotes (`Procedure '${fqn}' not found`), use singular subjects for rules ("An external module cannot ...") and include enough context to debug.
- In `catch`, type the error as `unknown`: `catch (error: unknown)`.

## Imports

Order the import blocks like this, with a blank line between blocks, and sort alphabetically within a block:

1. External dependencies (`node:path`, `express`, ...).
2. Core dependencies: other monorepo packages through `@jitar/...`.
3. Runtime dependencies: the package's own modules through relative paths. Group them by folder (definitions, errors, interfaces, models, utils) like `ExecutionManager.ts` does.
4. Types.

Use `import type` for imports that are only used as types (`import type Request from './models/Request';`, `import type { State } from './definitions/States';`).

## Style

The full list is in `CODING_STANDARDS.md` → Style. The rules that ESLint enforces or that are easy to miss:

- Every file starts with one empty line and ends with a newline (`jitar/empty-first-line`, `eol-last`).
- Allman braces. Simple bodies such as getters may stay on one line.
- Semicolons on every statement, 4 spaces per indent, single quotes, template strings instead of concatenation.
- Always use braces for `if`, `else` and loops.
- Compare explicitly: `if (procedure === undefined)`, `if ((segment instanceof Segment) === false)`. Do not rely on truthiness for objects or negate with `!`.
- Separate logical steps inside a method with blank lines.
- Prefer `.map` / `.filter` / `.find` over loops; use `for...of` when a loop is needed, and move an inner loop into its own method instead of nesting.
- Use arrow functions over anonymous function expressions, and only add parentheses around their parameters when needed.
- Comments start with `//`, are rare and explain *why*, not *what*.
- Treat objects and arrays you received as immutable.
- Never add `eslint-disable` comments without explicit approval. The accepted exception is `@typescript-eslint/no-unused-vars` for a parameter that an interface requires but the implementation does not use.

## Workflow

1. Read the package's `AGENTS.md` and the code you will change. Find an existing component that does something similar and use it as the template.
2. Decide where the change belongs. Put it in the lowest package that makes sense, and check the dependency direction before adding a `@jitar/*` dependency.
3. Implement the change: one file per component, in the right folder, with errors and definitions in their own files.
4. Export new public members from the (sub-module and) package `index.ts`. If Jitar users need them, also add them to `packages/jitar/src/lib.ts` or `client.ts`.
5. Add or update tests with the `write-test` skill.
6. Update the package's `AGENTS.md` when exports, dependencies, structure, errors or architecture decisions change.
7. Verify:
   - `npm run build` and `npm run test` in the package.
   - `npm run build:all` from the repository root when other packages depend on the changed package, or when the public API changed.
   - `npm run lint` from the repository root, fixing issues by hand (`--fix` is not supported).

## Checklist

- [ ] Code is in the right package and folder, one component per file, file name equal to the default export
- [ ] No new dependency cycles; cross-package imports use `@jitar/...` and are declared in `package.json`
- [ ] Classes use `#private` members, `readonly` where possible, getters for public state, and constructor-injected dependencies
- [ ] Methods declare return types; getters do not
- [ ] Constants are `as const` objects in `definitions/` with a derived type; defaults are applied with `??`
- [ ] Errors are specific classes in `errors/`, extend the right `@jitar/errors` base (or `Error`), and wrap causes with `{ cause }`
- [ ] Lifecycle components implement `start` / `stop` and wrap failures in `Starting*Failed` / `Stopping*Failed`
- [ ] Imports are grouped (external, `@jitar/*`, relative, types) and type-only imports use `import type`
- [ ] Public members are exported from `src/index.ts` (and the `jitar` umbrella when needed); internals are not
- [ ] File starts with an empty line, ends with a newline, uses Allman braces, semicolons and single quotes
- [ ] Tests are added or updated (`write-test` skill)
- [ ] The package's `AGENTS.md` reflects the change
- [ ] Build, tests and `npm run lint` pass
