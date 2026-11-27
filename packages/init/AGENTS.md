# @jitar/init

This file extends the root [`AGENTS.md`](../../AGENTS.md) with information specific to the init package.

## Purpose

This package provides the `InitManager` class for creating new Jitar applications from templates. It is consumed by the CLI package (`@jitar/cli`) via the `init` command.

## Exports

A single class is exported from `src/index.ts`:

| Exported Symbol | Type | Description |
|-----------------|------|-------------|
| `InitManager`   | class | Core class that validates names, verifies template existence, and copies template files to a project directory. |

## Dependencies

This package has no dependencies. It only uses Node built-ins (`node:fs`, `node:path`, `node:url`).

## Package structure

```
src/
├── InitManager.ts        ← Main class; validates names, verifies templates, copies template files
├── index.ts              ← Re-exports InitManager
└── errors/
    ├── InvalidName.ts    ← Thrown when a project or template name fails validation
    └── UnknownTemplate.ts ← Thrown when the requested template does not exist
templates/                ← Bundled project templates (backend, react, vue)
```

## Architecture

### Overview

#### InitManager

The `InitManager` class has two private fields:

| Field | Type | Description |
|-------|------|-------------|
| `#templateRootPath` | `string` | Resolved path to the `templates/` directory relative to the module. |
| `#projectRootPath` | `string` | Resolved absolute path where the new project will be created (defaults to `./`). |

**Constructor**: Accepts an optional `rootPath` string (defaults to `'./'`). Resolves the template root path and project root path.

**`init(projectName: string, templateName: string): Promise<void>`**: The single public method. Validates both names, verifies the template exists as a directory, then copies the template folder to the project root.

#### Error Classes

| Error Class | Constructor | Message |
|-------------|-------------|---------|
| `InvalidName` | `(name: string, type: string)` | `Invalid ${type} name: ${name}` |
| `UnknownTemplate` | `(templateName: string)` | `Unknown template: ${templateName}` |

Both extend `Error` directly. They follow the standard error class pattern: PascalCase class name, `export default class`, constructor calling `super(message)` with a message built from the constructor arguments.

### Decisions

- **Template resolution**: Templates are resolved relative to the module's location at runtime using `fileURLToPath(import.meta.url)`. This ensures templates are found regardless of the working directory.
- **Name validation**: Both project and template names are validated against `/^[a-zA-Z.\-_]+$/` before any file operations. Invalid names throw `InvalidName`.
- **Template verification**: The template name is verified by checking if a directory exists at `templates/<templateName>`. If not, `UnknownTemplate` is thrown.
- **Copy behavior**: Uses `fsp.cp()` with `{ recursive: true, force: true }` to copy the template directory, overwriting existing files.
- **No templating engine**: Templates are copied as-is. No variable substitution or file processing is performed.

## Coding Conventions

- Allman brace style, with `allowSingleLine: true` for simple single-line cases.
- Open curly braces always go on the next line.
- Use single quotes for strings. Use backticks with template expressions for concatenation.
- One trailing blank line at EOF.
- Private fields use JavaScript `#` syntax.
- No comments explaining the *what*; comments may explain the *why*.

## Templates

Three templates are bundled under `templates/`:

| Template | Description |
|----------|-------------|
| `backend` | A backend-only Jitar project with services and segments. |
| `react` | A Jitar project with a React frontend (Vite + React). |
| `vue` | A Jitar project with a Vue frontend (Vite + Vue). |

Templates are validated by checking if the requested template name corresponds to an existing directory under `templates/`. The name validation regex is `/^[a-zA-Z.\-_]+$/`. The `jitar` package copies these templates into its `dist/templates` during its build.

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

## Configuration

- Extends root `tsconfig.json` with `rootDir: ./src` and `outDir: ./dist`.
- Package is `private: true` — it is not published independently.
- TypeScript target: `esnext`, module: `esnext`, moduleResolution: `bundler`.
- Uses ES modules (`"type": "module"`).

## Commands

| Command | Script | Description |
|---------|--------|-------------|
| `npm run build` | `tsc -p tsconfig.json` | Compile to `./dist` |
| `npm run lint` | `eslint` | Lint source files |
| `npm run clean` | `shx rm -rf dist` | Remove build artifacts |

The package has no `test` script (a `vitest.config.ts` exists, but there is no `test/` folder).

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
