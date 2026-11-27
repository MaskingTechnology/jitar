# @jitar/errors

This file extends the root [`AGENTS.md`](../../AGENTS.md) with information specific to the errors package.

## Purpose

This package provides the base HTTP-status-code-inspired error classes for the Jitar runtime. All errors extend JavaScript's native `Error` directly.

## Exports

Eight error classes are exported from `src/index.ts`:

| Exported Symbol   | Type  | Description (default message) |
|-------------------|-------|-------------------------------|
| `BadRequest`      | class | "Invalid request"             |
| `Forbidden`       | class | "Forbidden"                   |
| `NotFound`        | class | "Not found"                   |
| `NotImplemented`  | class | "Not implemented"             |
| `PaymentRequired` | class | "Payment required"            |
| `ServerError`     | class | "Server error"                |
| `Teapot`          | class | "I'm a teapot"                |
| `Unauthorized`    | class | "Unauthorized"                |

## Dependencies

This package has no dependencies.

## Package structure

```
src/
├── BadRequest.ts         ← One error class per file
├── Forbidden.ts
├── NotFound.ts
├── NotImplemented.ts
├── PaymentRequired.ts
├── ServerError.ts
├── Teapot.ts
├── Unauthorized.ts
└── index.ts              ← Re-exports all errors as named exports
```

## Architecture

### Overview

Each error is a plain class extending `Error` with a default message. Other packages import and extend these base errors. Common patterns:

- **Extend a base error**: `class MyError extends NotFound` (e.g., `ImplementationNotFound extends NotFound`)
- **Import directly**: `import { NotFound } from '@jitar/errors'`
- **Re-exported by `jitar`**: Both `lib.ts` and `client.ts` re-export all eight errors.

### Decisions

- **Extend `Error` directly**: No intermediate base class; no extra properties.
- **Base errors for the whole runtime**: When creating package-specific errors, extend the appropriate base error from `@jitar/errors` rather than creating a new `Error` subclass.

## Coding Conventions

### Error Class Pattern

Each error class follows this exact structure:

```typescript
export default class <Name> extends Error
{
    constructor(message = 'default message')
    {
        super(message);
    }
}
```

#### Rules
- **Class name**: PascalCase, matching the file name exactly.
- **Export**: `export default class`, never named exports.
- **Base class**: Always extends `Error` directly.
- **Constructor**: Accepts an optional `message` string parameter with a sensible default.
- **`super(message)`**: Always call `super(message)` — do not add extra properties.
- **File structure**: One class per file, no trailing whitespace beyond the closing brace and newline.

### Index Exports

`src/index.ts` re-exports all errors as named exports using the `default as <Name>` pattern:

```typescript
export { default as BadRequest } from './BadRequest';
```

Do not change the export order or naming convention in `index.ts`.

## Configuration

- Extends root `tsconfig.json` with `rootDir: ./src` and `outDir: ./dist`.
- Package is `private: true` — it is not published independently.
- TypeScript target: `esnext`, module: `esnext`, moduleResolution: `bundler`.

## Adding a New Error

1. Create a new file under `src/<Name>.ts`.
2. Follow the error class pattern (PascalCase, extends `Error`, default message in constructor).
3. Add a named export in `src/index.ts` following the existing convention.
4. Ensure the file has no trailing whitespace beyond the closing brace and a single newline.

## Tests

This package has no tests. As long as it only contains Error objects, there is no need for testing.

## Commands

| Command | Script | Description |
|---------|--------|-------------|
| `npm run build` | `tsc -p tsconfig.json` | Compile to `./dist` |
| `npm run lint` | `eslint` | Lint source files |
| `npm run clean` | `shx rm -rf dist` | Remove build artifacts |
| `npm run test` | (empty) | No-op; the package has no tests |

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
