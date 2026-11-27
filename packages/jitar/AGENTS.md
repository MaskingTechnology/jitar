# jitar

This file extends the root [`AGENTS.md`](../../AGENTS.md) with information specific to the main `jitar` package.

## Purpose

This is the main **umbrella package** for the Jitar distributed runtime. It re-exports core types, classes, and functionality from other `@jitar/*` packages, providing a single entry point to all core runtime features. Unlike the internal `@jitar/*` packages, it is published (`private: false`, Node `>=22`).

## Exports

This package publishes **three entry points** via Rollup:

| Entry | Source | Output | Browser Support |
|-------|--------|--------|-----------------|
| `.` (default) | `src/lib.ts` | `dist/lib.js` (types `dist/lib.d.ts`) | No (server-side) |
| `./client` | `src/client.ts` | `dist/client.js` | Yes (browser-compatible) |
| `bin.jitar` | `src/cli.ts` | `dist/cli.js` | No (CLI executable) |

### `.` (`src/lib.ts`)

| Exported Symbol | Type | Description |
|-----------------|------|-------------|
| `BuildHelper` | class | From `@jitar/build` |
| `ConfigurationManager` | class | From `@jitar/configuration` |
| `BadRequest`, `Forbidden`, `NotFound`, `NotImplemented`, `PaymentRequired`, `ServerError`, `Teapot`, `Unauthorized` | class | Error classes from `@jitar/errors` |
| `Request`, `Response`, `Segment`, `Class`, `Procedure`, `Implementation`, `Version`, `NamedParameter`, `ArrayParameter`, `ObjectParameter` | class | Execution types from `@jitar/execution` |
| `Middleware`, `NextHandler` | interface / type | From `@jitar/middleware` |
| `HealthCheck` | interface | From `@jitar/health` |

### `./client` (`src/client.ts`)

| Exported Symbol | Type | Description |
|-----------------|------|-------------|
| `BadRequest`, `Forbidden`, `NotFound`, `NotImplemented`, `PaymentRequired`, `ServerError`, `Teapot`, `Unauthorized` | class | Error classes from `@jitar/errors` |
| `Request`, `Response`, `Segment`, `Class`, `Procedure`, `Implementation`, `Version`, `NamedParameter`, `ArrayParameter`, `ObjectParameter` | class | Execution types from `@jitar/execution` |
| `Middleware`, `NextHandler` | interface / type | From `@jitar/middleware` |
| `ClientBuilder` | class | From `@jitar/runtime` |
| `HttpRemoteBuilder` | class | From `@jitar/http` |

### CLI (`src/cli.ts`)

CLI entry point (`#!/usr/bin/env node`) — instantiates `Cli` from `@jitar/cli` and starts it; on failure logs with `Logger.fatal()` from `@jitar/logging` and sets `process.exitCode = 1`.

## Dependencies

This package re-exports from the following internal packages — never implement functionality directly here:

| Package | Usage |
| --- | --- |
| `@jitar/build` | `BuildHelper` (lib.ts only) |
| `@jitar/configuration` | `ConfigurationManager` (lib.ts only) |
| `@jitar/errors` | Error classes (BadRequest, NotFound, ServerError, etc.) |
| `@jitar/execution` | Execution types (Request, Response, Segment, Procedure, etc.) |
| `@jitar/health` | `HealthCheck` (lib.ts only) |
| `@jitar/middleware` | `Middleware`, `NextHandler` |
| `@jitar/cli` | `Cli` (cli.ts only) |
| `@jitar/logging` | `Logger` (cli.ts only) |
| `@jitar/runtime` | `ClientBuilder` (client.ts only) |
| `@jitar/http` | `HttpRemoteBuilder` (client.ts only) |

The `@jitar/*` packages are listed as `devDependencies` because they are bundled.

Runtime `dependencies` (kept external in the server bundles, see below):

| Package | Usage |
| --- | --- |
| `express` | HTTP server (used by bundled server code) |
| `glob` | File pattern matching (used by bundled code) |
| `mime-types` | Content type resolution (used by bundled code) |
| `dotenv` | Environment file loading (used by bundled code) |

Build tooling (`devDependencies`): `rollup`, `@rollup/plugin-node-resolve`, `@rollup/plugin-replace`, `@rollup/plugin-terser`, `@rollup/plugin-typescript`, `rollup-plugin-dts`.

## Package structure

```
src/
├── lib.ts       ← Server-side library exports (BuildHelper, ConfigurationManager, errors, execution types, middleware, health)
├── cli.ts       ← CLI entry point — instantiates `Cli` from `@jitar/cli` with a `Logger`
└── client.ts    ← Browser/client-side exports (errors, execution types, middleware, ClientBuilder, HttpRemoteBuilder)
rollup.config.js        ← Bundle and type declaration configuration
rollup.definitions.js   ← SERVER_EXTERNALS list
```

## Architecture

### Overview

#### Build Process

Built with **Rollup** (see `rollup.config.js`). The build pipeline:

1. **Bundle** TypeScript entry points into ES modules with terser minification (`mangle: false`)
   - `src/cli.ts` + `src/lib.ts` → `dist/` (node resolution)
   - `src/client.ts` → `dist/client.js` (browser node resolution)
2. **Type declarations** generated via `rollup-plugin-dts` (`dist/types/lib.d.ts` → `dist/lib.d.ts`; `dist/types` is excluded from the published files)
3. **Copy** templates from `@jitar/init` into `dist/templates`
4. **Finalize** — make `dist/cli.js` executable

#### Server externals

The server bundles (`lib.js`, `cli.js`) mark these as external (not bundled):

```js
['express', 'glob', 'mime-types', 'dotenv']
```

See `rollup.definitions.js` for the full list.

### Decisions

- **Re-export umbrella**: No business logic lives here; all functionality belongs in the appropriate `@jitar/*` package.
- **Separate client entry**: The client entry point is bundled for the browser and excludes server-side dependencies.
- **Bundled internals**: Internal `@jitar/*` packages are bundled into the output, so only the external Node dependencies are runtime `dependencies`.
- **Tree shaking without module side effects**: Rollup uses `treeshake.moduleSideEffects: false`.

## Coding Conventions

- **Do not implement business logic here.** This package is a re-export umbrella — all functionality belongs in the appropriate `@jitar/*` package.
- All intra-monorepo imports must use workspace aliases (`@jitar/...`), never relative paths.
- The client entry point (`src/client.ts`) must **not** import server-side dependencies (build, configuration, health).
- Follow the monorepo-wide [CODING_STANDARDS.md](../../CODING_STANDARDS.md) for naming, style, and formatting conventions.
- Keep source files minimal — each entry point file should be a thin re-export layer.

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Full build (clean → bundle → copy → finalize) |
| `npm run lint` | ESLint check |
| `npm run clean` | Remove `dist/` directory |
| `npm run bundle` | Run Rollup (`rollup -c`) |
| `npm run copy` | Copy `../init/templates` to `dist/templates` |
| `npm run finalize` | Make `dist/cli.js` executable |
| `npm run prepublishOnly` | Clean and build before publishing |

The package has no `test` script.

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
