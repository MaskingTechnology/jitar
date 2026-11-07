# Plugin Vite Package

## Overview

This package provides a Vite plugin for building [Jitar](https://jitar.dev/) applications. It integrates Jitar's client-side runtime with Vite's build pipeline, handling segment generation, bundle creation, and RPC proxy configuration.

## Dependencies

- **Peer Dependencies:**
  - `jitar` (>0.12) — provides `ConfigurationManager` and `BuildHelper`
  - `vite` (>=7, optional) — provides Vite plugin infrastructure (`PluginOption`, `ResolvedConfig`, `normalizePath`)
- **Dev Dependencies:**
  - `vite` (^8.3.5)

## Package Structure

Single-file package: `src/index.ts` exports the default plugin function and the `JitarConfig` type.

## Build & Lint Commands

```bash
npm run build    # Build with TypeScript: tsc -p tsconfig.json
npm run lint     # Lint with ESLint
npm run clean    # Remove dist/ directory: shx rm -rf dist
```

The `prepublishOnly` script runs `clean` then `build` automatically.

## Exports

### `default` — `viteJitar(pluginConfig: PluginConfig): PluginOption`

The main entry point. Returns a Vite plugin object implementing the following lifecycle hooks:

| Hook | Description |
|---|---|
| `config()` | Sets ESNext as the build target and configures a `/rpc` server proxy to the Jitar URL. |
| `configResolved(resolvedConfig)` | Resolves Vite, project, and Jitar paths based on the resolved config and plugin config. |
| `buildStart()` | Loads the Jitar runtime configuration via `ConfigurationManager`, initializes `BuildHelper`, and reads the application. |
| `resolveId(id)` | Resolves special IDs: `jitar-bundle`, `jitar`, and `segment:<name>` to their internal resolved IDs. |
| `load(id)` | Loads the generated Jitar bundle code or segment/module code via `BuildHelper`. |
| `transform(code, id)` | Injects an import of the Jitar bundle into the first application component file. |

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
## Plugin Lifecycle Details

### `config()`

Returns Vite config overrides:
- `build.target: 'esnext'` — ensures modern JS output.
- `server.proxy['/rpc']` — proxies RPC calls to the configured Jitar URL.

### `configResolved(resolvedConfig)`

Computes all path references:
1. `paths.vite.input` — Vite root (project root).
2. `paths.vite.output` — Vite output directory.
3. `paths.vite.assetOutput` — Vite assets subdirectory.
4. `paths.project.root` — Project root (resolved from `projectRoot` config).
5. `paths.project.source` — Source root (resolved from `sourceRoot` config).

### `buildStart()`

1. Resets `jitarImported` flag.
2. Creates a `ConfigurationManager` from `paths.project.root`.
3. Optionally loads an environment file if `environmentFile` is specified.
4. Loads the runtime configuration via `getRuntimeConfiguration(configurationFile)`.
5. Resolves Jitar input/output paths from the configuration.
6. Initializes `BuildHelper` and reads the application model.

### `resolveId(id)`

Handles four ID resolution cases:
1. `'jitar-bundle'` → `'\0jitar-bundle'` (virtual bundle).
2. `'jitar'` → `'\0jitar-bundle'` (redirects to the bundle).
3. `'segment:<name>'` → `'\0segment:<name>'` (virtual segment).
4. Everything else → `null` (pass through).

### `load(id)`

Handles four load cases:
1. `'\0jitar-bundle'` — Generates the full Jitar client bundle via `createJitarBundle()`.
2. `'\0segment:<name>'` — Generates segment code via `BuildHelper.generateSegmentCode()`.
3. Source files under `paths.project.source` — Generates module code via `BuildHelper.generateModuleCode()` if the module is part of the application.
4. Everything else → `null` (pass through).

### `transform(code, id)`

Injects `import 'jitar-bundle';` into the first application component file (`.js`, `.ts`, `.jsx`, `.tsx`) that starts from the project source. Subsequent files are left unchanged.

## Helper Functions

### `assureExtension(filename: string): string`

Appends `.js` extension if the filename does not already end with `.js`.

### `createJitarBundle(segments: string[], middlewares: string[], targetPath: string): string`

Generates the complete Jitar client bundle source code as a string. The generated code:

1. **Imports** `ClientBuilder` and `HttpRemoteBuilder` from `jitar/client`.
2. **Imports** each segment as `$S<n>` from `segment:<name>`.
3. **Imports** each middleware as `$M<n>` from its normalized file path.
4. **Declares** `remoteUrl` (from `document.location.origin`), `segments` array, and `middleware` array.
5. **Creates** `HttpRemoteBuilder` and `ClientBuilder`, builds the client, and calls `client.start()`.
6. **Re-exports** everything from `jitar/client`.

## Coding Conventions

- **ES Module** (`"type": "module"` in `package.json`).
- **Typescript** with `module: esnext` and `target: esnext` (inherited from root `tsconfig.json`).
- **Allman brace style** with `allowSingleLine: true` (from root ESLint config).
- **Single quotes** for strings (from `CODING_STANDARDS.md`).
- **No comments** except to explain the "why" (from `CODING_STANDARDS.md`).
- **Private members** use `#` prefix (from `CODING_STANDARDS.md`).
- **Path normalization** via Vite's `normalizePath()` for cross-platform compatibility.
- **Vite virtual modules** use the `\0` prefix convention.
