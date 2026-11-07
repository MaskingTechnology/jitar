# Jitar Package Agent Guidelines

## Package Overview

This is the main **umbrella package** for the Jitar distributed runtime. It re-exports core types, classes, and functionality from other `@jitar/*` packages, providing a single entry point to all core runtime features.

## Source Files

| File | Purpose |
|------|---------|
| `src/lib.ts` | Server-side library exports (BuildHelper, ConfigurationManager, errors, execution types, middleware, health) |
| `src/cli.ts` | CLI entry point — instantiates `Cli` from `@jitar/cli` with a `Logger` |
| `src/client.ts` | Browser/client-side exports (errors, execution types, middleware, ClientBuilder, HttpRemoteBuilder) |

## Entry Points

This package publishes **three entry points** via Rollup:

| Entry | Output | Browser Support |
|-------|--------|-----------------|
| `.` (default) | `dist/lib.js` | No (server-side) |
| `./client` | `dist/client.js` | Yes (browser-compatible) |

The CLI is exposed via `bin.jitar` → `dist/cli.js`.

## Dependencies

This package re-exports from the following internal packages — never implement functionality directly here:

- `@jitar/build` → BuildHelper
- `@jitar/configuration` → ConfigurationManager
- `@jitar/errors` → Error classes (BadRequest, NotFound, ServerError, etc.)
- `@jitar/execution` → Execution types (Request, Response, Segment, Procedure, etc.)
- `@jitar/health` → HealthCheck
- `@jitar/middleware` → Middleware, NextHandler
- `@jitar/cli` → Cli (used in cli.ts only)
- `@jitar/logging` → Logger (used in cli.ts only)
- `@jitar/runtime` → ClientBuilder (client.ts only)
- `@jitar/http` → HttpRemoteBuilder (client.ts only)

## Build Process

Built with **Rollup** (see `rollup.config.js`). The build pipeline:

1. **Bundle** TypeScript entry points into ES modules with terser minification
2. **Type declarations** generated via `rollup-plugin-dts`
3. **Copy** templates from `@jitar/init` into `dist/templates`

### Key build commands

```bash
npm run build        # Full build (clean → bundle → copy → finalize)
npm run lint         # ESLint check
npm run validate     # TypeScript type check
```

### Server externals

The server bundles (`lib.js`, `cli.js`) mark these as external (not bundled):

```js
['express', 'glob', 'mime-types', 'dotenv']
```

See `rollup.definitions.js` for the full list.

## Important Rules

- **Do not implement business logic here.** This package is a re-export umbrella — all functionality belongs in the appropriate `@jitar/*` package.
- All intra-monorepo imports must use workspace aliases (`@jitar/...`), never relative paths.
- The client entry point (`src/client.ts`) must **not** import server-side dependencies (build, configuration, health).
- Follow the monorepo-wide [CODING_STANDARDS.md](../../CODING_STANDARDS.md) for naming, style, and formatting conventions.
- Keep source files minimal — each entry point file should be a thin re-export layer.

## Testing

Tests are configured via `vitest.config.ts`. Run with:

```bash
npm run test
```
