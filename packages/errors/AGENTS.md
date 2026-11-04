# @jitar/errors — Package Guidelines

## Overview

This package provides the base HTTP-status-code-inspired error classes for the Jitar runtime. All errors extend JavaScript's native `Error` directly.

## Exports

Eight error classes are exported from `src/index.ts`:

| Error Class       | Default Message       |
|-------------------|-----------------------|
| `BadRequest`      | "Invalid request"     |
| `Forbidden`       | "Forbidden"           |
| `NotFound`        | "Not found"           |
| `NotImplemented`  | "Not implemented"     |
| `PaymentRequired` | "Payment required"    |
| `ServerError`     | "Server error"        |
| `Teapot`          | "I'm a teapot"        |
| `Unauthorized`    | "Unauthorized"        |

## Error Class Pattern

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

### Rules
- **Class name**: PascalCase, matching the file name exactly.
- **Export**: `export default class`, never named exports.
- **Base class**: Always extends `Error` directly.
- **Constructor**: Accepts an optional `message` string parameter with a sensible default.
- **`super(message)`**: Always call `super(message)` — do not add extra properties.
- **File structure**: One class per file, no trailing whitespace beyond the closing brace and newline.

## Index Exports

`src/index.ts` re-exports all errors as named exports using the `default as <Name>` pattern:

```typescript
export { default as BadRequest } from './BadRequest';
```

Do not change the export order or naming convention in `index.ts`.

## Consumption by Other Packages

Other packages import and extend these base errors. Common patterns:

- **Extend a base error**: `class MyError extends NotFound` (e.g., `ImplementationNotFound extends NotFound`)
- **Import directly**: `import { NotFound } from '@jitar/errors'`
- **Re-exported by `jitar`**: Both `lib.ts` and `client.ts` re-export all eight errors.

When creating package-specific errors, extend the appropriate base error from `@jitar/errors` rather than creating a new `Error` subclass.

## Build Commands

| Script   | Command                    | Description              |
|----------|----------------------------|--------------------------|
| build    | `tsc -p tsconfig.json`     | Compile to `./dist`      |
| lint     | `eslint`                   | Lint source files        |
| clean    | `shx rm -rf dist`          | Remove build artifacts   |

## Configuration

- Extends root `tsconfig.json` with `rootDir: ./src` and `outDir: ./dist`.
- Package is `private: true` — it is not published independently.
- TypeScript target: `esnext`, module: `esnext`, moduleResolution: `bundler`.

## Adding a New Error

1. Create a new file under `src/<Name>.ts`.
2. Follow the error class pattern (PascalCase, extends `Error`, default message in constructor).
3. Add a named export in `src/index.ts` following the existing convention.
4. Ensure the file has no trailing whitespace beyond the closing brace and a single newline.