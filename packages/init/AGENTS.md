# @jitar/init — Package Guidelines

## Overview

This package provides the `InitManager` class for creating new Jitar applications from templates. It is consumed by the CLI package (`@jitar/cli`) via the `init` command.

## Exports

A single class is exported from `src/index.ts`:

| Exported Symbol | Description |
|-----------------|-------------|
| `InitManager`   | Core class that validates names, verifies template existence, and copies template files to a project directory. |

## Architecture

```
src/
├── InitManager.ts        ← Main class; validates names, verifies templates, copies template files
├── index.ts              ← Re-exports InitManager
└── errors/
    ├── InvalidName.ts    ← Thrown when a project or template name fails validation
    └── UnknownTemplate.ts ← Thrown when the requested template does not exist
```

### InitManager

The `InitManager` class has two private fields:

| Field | Type | Description |
|-------|------|-------------|
| `#templateRootPath` | `string` | Resolved path to the `templates/` directory relative to the module. |
| `#projectRootPath` | `string` | Resolved absolute path where the new project will be created (defaults to `./`). |

**Constructor**: Accepts an optional `rootPath` string (defaults to `'./'`). Resolves the template root path and project root path.

**`init(projectName: string, templateName: string): Promise<void>`**: The single public method. Validates both names, verifies the template exists as a directory, then copies the template folder to the project root.

### Error Classes

| Error Class | Default Message |
|-------------|-----------------|
| `InvalidName` | `Invalid ${type} name: ${name}` |
| `UnknownTemplate` | `Unknown template: ${templateName}` |

Both extend `Error` directly. They follow the standard error class pattern: PascalCase class name, `export default class`, optional message in the constructor calling `super(message)`.

## Templates

Three templates are bundled under `templates/`:

| Template | Description |
|----------|-------------|
| `backend` | A backend-only Jitar project with services and segments. |
| `react` | A Jitar project with a React frontend (Vite + React). |
| `vue` | A Jitar project with a Vue frontend (Vite + Vue). |

Templates are validated by checking if the requested template name corresponds to an existing directory under `templates/`. The name validation regex is `/^[a-zA-Z.\-_]+$/`.

## Consumed By

The CLI package imports and uses `InitManager`:

```typescript
import { InitManager } from '@jitar/init';

const initManager = new InitManager(rootPath);
await initManager.init(projectName, templateName);
```

The CLI `InitApp` command passes three CLI arguments:
- `--name` (required): The project name used for creating the project folder.
- `--template` (required): The template to use (`react`, `vue`, or `backend`).
- `--location` (optional): The root location for the project (defaults to `'./'`).

## Build Commands

| Script | Command | Description |
|--------|---------|-------------|
| build | `tsc -p tsconfig.json` | Compile to `./dist` |
| lint | `eslint` | Lint source files |
| clean | `shx rm -rf dist` | Remove build artifacts |

## Configuration

- Extends root `tsconfig.json` with `rootDir: ./src` and `outDir: ./dist`.
- Package is `private: true` — it is not published independently.
- TypeScript target: `esnext`, module: `esnext`, moduleResolution: `bundler`.
- Uses ES modules (`"type": "module"`).

## Code Style

- Allman brace style, with `allowSingleLine: true` for simple single-line cases.
- Open curly braces always go on the next line.
- Use single quotes for strings. Use backticks with template expressions for concatenation.
- One trailing blank line at EOF.
- Private fields use JavaScript `#` syntax.
- No comments explaining the *what*; comments may explain the *why*.

## Key Implementation Notes

- **Template resolution**: Templates are resolved relative to the module's location at runtime using `fileURLToPath(import.meta.url)`. This ensures templates are found regardless of the working directory.
- **Name validation**: Both project and template names are validated against `/^[a-zA-Z.\-_]+$/` before any file operations. Invalid names throw `InvalidName`.
- **Template verification**: The template name is verified by checking if a directory exists at `templates/<templateName>`. If not, `UnknownTemplate` is thrown.
- **Copy behavior**: Uses `fsp.cp()` with `{ recursive: true, force: true }` to copy the template directory, overwriting existing files.
- **No templating engine**: Templates are copied as-is. No variable substitution or file processing is performed.