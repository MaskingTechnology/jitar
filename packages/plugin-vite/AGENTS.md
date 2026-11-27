# @jitar/plugin-vite

This file extends the root [`AGENTS.md`](../../AGENTS.md) with package-specific information.

## Purpose

This package provides a Vite plugin for building Jitar applications. It integrates Jitar's client-side runtime with Vite's build pipeline, handling segment generation, bundle creation, and RPC proxy configuration.

## Exports

Single entry point (`.` → `./dist/index.js`, types `./dist/index.d.ts`), exported from `src/index.ts`:

| Exported Symbol | Type | Description |
|---|---|---|
| `default` (`viteJitar`) | function | `viteJitar(pluginConfig: PluginConfig): PluginOption` — creates the Vite plugin |
| `JitarConfig` | type | Public alias for the internal `PluginConfig` type |

### `JitarConfig` (type alias for `PluginConfig`)

The public configuration type. When used in `vite.config.ts`, the property names map as follows:

| Public (README) | Internal (`PluginConfig`) | Required | Description |
|---|---|---|---|
| `sourceDir` | `sourceRoot` | Yes | The folder containing the app's source files (e.g., `src`). |
| `targetDir` | (resolved from Vite `build.outDir`) | — | The folder where distribution files are output (e.g., `dist`). |
| `jitarDir` | (resolved from runtime config) | — | The folder containing Jitar source files, relative to the project root. |
| `jitarUrl` | `jitarUrl` | Yes | The URL of the Jitar server instance (used for RPC proxy). |
| `segments` | `segments` | No | Array of segment names for the client app (default: `[]`). |
| `middleware` | `middleware` | No | Array of middleware names for the client app (default: `[]`). |

Additional internal properties not exposed in the README:

| Property | Required | Description |
|---|---|---|
| `projectRoot` | Yes | The project root directory path. |
| `configurationFile` | No | Path to the Jitar runtime configuration file. |
| `environmentFile` | No | Path to an environment file for `ConfigurationManager`. |

## Dependencies

No regular dependencies.

| Package | Kind | Usage |
| --- | --- | --- |
| `jitar` | peer (`>0.12`) | Provides `ConfigurationManager` and `BuildHelper`; the generated bundle imports `ClientBuilder` and `HttpRemoteBuilder` from `jitar/client` |
| `vite` | peer (`>=7`, optional), dev (`^8.3.8`) | Provides Vite plugin infrastructure (`PluginOption`, `ResolvedConfig`, `normalizePath`) |
| `node:path` | built-in | Path joining |

## Package structure

Single-file package:

```
src/
└── index.ts    ← Plugin function (viteJitar), JitarConfig type, internal types, constants and helpers
```

## Architecture

### Overview

`viteJitar(pluginConfig)` returns a Vite plugin object (name `jitar-plugin-vite`, `enforce: 'pre'`) implementing the following lifecycle hooks:

| Hook | Description |
|---|---|
| `config()` | Sets ESNext as the build target and configures a `/rpc` server proxy to the Jitar URL. |
| `configResolved(resolvedConfig)` | Resolves Vite, project, and Jitar paths based on the resolved config and plugin config. |
| `buildStart()` | Loads the Jitar runtime configuration via `ConfigurationManager`, initializes `BuildHelper`, and reads the application. |
| `resolveId(id)` | Resolves special IDs: `jitar-bundle`, `jitar`, and `segment:<name>` to their internal resolved IDs. |
| `load(id)` | Loads the generated Jitar bundle code or segment/module code via `BuildHelper`. |
| `transform(code, id)` | Injects an import of the Jitar bundle into the first application component file. |

### Plugin Lifecycle Details

#### `config()`

Returns Vite config overrides:
- `build.target: 'esnext'` — ensures modern JS output.
- `server.proxy['/rpc']` — proxies RPC calls to the configured Jitar URL.

#### `configResolved(resolvedConfig)`

Computes all path references:
1. `paths.vite.input` — Vite root (project root).
2. `paths.vite.output` — Vite output directory.
3. `paths.vite.assetOutput` — Vite assets subdirectory.
4. `paths.project.root` — Project root (resolved from `projectRoot` config).
5. `paths.project.source` — Source root (resolved from `sourceRoot` config).

#### `buildStart()`

1. Resets `jitarImported` flag.
2. Creates a `ConfigurationManager` from `paths.project.root`.
3. Optionally loads an environment file if `environmentFile` is specified.
4. Loads the runtime configuration via `getRuntimeConfiguration(configurationFile)`.
5. Resolves Jitar input/output paths from the configuration.
6. Initializes `BuildHelper` and reads the application model.

#### `resolveId(id)`

Handles four ID resolution cases:
1. `'jitar-bundle'` → `'\0jitar-bundle'` (virtual bundle).
2. `'jitar'` → `'\0jitar-bundle'` (redirects to the bundle).
3. `'segment:<name>'` → `'\0segment:<name>'` (virtual segment).
4. Everything else → `null` (pass through).

#### `load(id)`

Handles four load cases:
1. `'\0jitar-bundle'` — Sets `jitarImported` and generates the full Jitar client bundle via `createJitarBundle()`.
2. `'\0segment:<name>'` — Generates segment code via `BuildHelper.generateSegmentCode()`, rewriting `from './` imports to the project source path and stripping the `.<segmentName>.js` suffix to `.js`.
3. Source files under `paths.project.source` — Generates module code via `BuildHelper.generateModuleCode()` if the module is part of the application (`BuildHelper.includesModule()`). Ids that also start with `paths.vite.input`, or that do not end in `.js` after replacing `.ts`, return `null`.
4. Everything else → `null` (pass through).

#### `transform(code, id)`

Injects `import 'jitar-bundle';` into the first application component file (`.js`, `.ts`, `.jsx`, `.tsx`) that starts from the project source. Subsequent files are left unchanged.

### Decisions

- **Virtual modules for the runtime**: The Jitar client bundle and segments are generated on the fly as Vite virtual modules instead of files on disk.
- **`jitar` redirects to the bundle**: Importing `jitar` in the client app resolves to the generated bundle, which re-exports `jitar/client`, so the client is always started before use.
- **Auto-injected bundle import**: The bundle import is injected into the first application component, so apps need no manual bootstrap code.
- **RPC via dev-server proxy**: `/rpc` is proxied to `jitarUrl`; the generated client uses `document.location.origin` as remote URL.

## Coding Conventions

- **ES Module** (`"type": "module"` in `package.json`).
- **Typescript** with `module: esnext` and `target: esnext` (inherited from root `tsconfig.json`).
- **Allman brace style** with `allowSingleLine: true` (from root ESLint config).
- **Single quotes** for strings (from `CODING_STANDARDS.md`).
- **No comments** except to explain the "why" (from `CODING_STANDARDS.md`).
- **Private members** use `#` prefix (from `CODING_STANDARDS.md`).
- **Path normalization** via Vite's `normalizePath()` for cross-platform compatibility.
- **Vite virtual modules** use the `\0` prefix convention.

## Internal Types

### `PluginPaths`

Tracks resolved paths across the three layers of the build:

```ts
type PluginPaths = {
    vite: {
        input?: string;       // Vite root (project root)
        output?: string;      // Vite output dir (e.g., dist)
        assetOutput?: string; // Vite assets subdirectory (e.g., dist/assets)
    };
    project: {
        root?: string;        // Project root (e.g., src)
        source?: string;      // Source root (e.g., src)
    };
    jitar: {
        input?: string;       // Jitar source dir (e.g., src/domain)
        output?: string;      // Jitar target dir (e.g., dist/domain)
    };
};
```

## Internal Constants

| Constant | Value | Purpose |
|---|---|---|
| `JITAR_SOURCE_ID` | `'jitar'` | Virtual module ID for the Jitar source. |
| `JITAR_CLIENT_ID` | `'jitar/client'` | The Jitar client package identifier. |
| `JITAR_BUNDLE_ID` | `'jitar-bundle'` | Virtual bundle module ID. |
| `JITAR_BUNDLE_RESOLVE_ID` | `'\0jitar-bundle'` | NUL-prefixed resolved bundle ID (Vite virtual module convention). |
| `APP_SEGMENT_ID` | `'segment:'` | Segment identifier prefix. |
| `APP_SEGMENT_RESOLVE_ID` | `'\0segment:'` | NUL-prefixed resolved segment ID. |

## Helper Functions

### `assureExtension(filename: string): string`

Appends `.js` extension if the filename does not already end with `.js`.

### `createJitarBundle(segments: string[], middlewares: string[], targetPath: string): string`

Generates the complete Jitar client bundle source code as a string. The generated code:

1. **Imports** `ClientBuilder` and `HttpRemoteBuilder` from `jitar/client`.
2. **Imports** each segment as `$S<n>` from `segment:<name>`.
3. **Imports** each middleware as `$M<n>` from its normalized file path (joined with `targetPath`, the Vite output directory).
4. **Declares** `remoteUrl` (from `document.location.origin`), `segments` array, and `middleware` array.
5. **Creates** `HttpRemoteBuilder` and `ClientBuilder`, builds the client, and calls `client.start()`.
6. **Re-exports** everything from `jitar/client`.

## Commands

| Command | Script | Description |
|---|---|---|
| `npm run build` | `tsc -p tsconfig.json` | Build with TypeScript |
| `npm run lint` | `eslint` | Lint with ESLint |
| `npm run clean` | `shx rm -rf dist` | Remove `dist/` directory |
| `npm run prepublishOnly` | `npm run clean && npm run build` | Runs `clean` then `build` automatically before publishing |

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
