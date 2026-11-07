# @jitar/sourcing — Package Guidelines

## Purpose

This package provides application sourcing (file and module) functionality for the Jitar runtime. It offers a unified interface for:

- **File sourcing** — Reading, filtering, and managing files from local or remote storage
- **Module sourcing** — Dynamically importing JavaScript/TypeScript modules

The package is organized around a `SourcingManager` facade that coordinates a `FileManager` for file operations and an `ImportManager` for module operations.

## Package Structure

```
src/
├── index.ts                    # Main entry point — re-exports all public symbols
├── SourcingManager.ts          # Abstract base — coordinates file and module operations
├── LocalSourcingManager.ts     # Concrete implementation for local file system
├── RemoteSourcingManager.ts    # Concrete implementation for remote (placeholder)
├── files/                      # File sourcing subsystem
│   ├── index.ts                # Re-exports file-related symbols
│   ├── FileManager.ts          # Base file manager — path validation, MIME types, CRUD
│   ├── LocalFileManager.ts     # Local file system implementation
│   ├── LocalFileSystem.ts      # Node.js file system adapter (fs, glob, mime-types)
│   ├── RemoteFileManager.ts    # Remote file system (placeholder — throws)
│   ├── RemoteFileSystem.ts     # Remote file system stub (all operations throw)
│   ├── definitions/
│   │   └── Files.ts            # Pattern constants (MODULE, RESOURCE, SEGMENT)
│   ├── errors/
│   │   ├── FileNotFound.ts     # Thrown when a file cannot be found
│   │   ├── InvalidLocation.ts  # Thrown when path escapes the root
│   │   └── RemoteFilesNotSupported.ts  # Thrown by remote operations
│   ├── interfaces/
│   │   ├── FileReader.ts       # Interface for file read operations
│   │   └── FileSystem.ts       # Interface for file system operations
│   └── models/
│       └── File.ts             # File model with location, type, content, size
└── modules/                    # Module sourcing subsystem
    ├── index.ts                # Re-exports module-related symbols
    ├── ImportManager.ts        # Base module importer — dynamic import wrapper
    ├── LocalImportManager.ts   # Local module import implementation
    ├── LocalModuleLocator.ts   # Local module path resolution (file:// URLs)
    ├── RemoteImportManager.ts  # Remote module import (placeholder — throws)
    ├── RemoteModuleLocator.ts  # Remote module path resolution (placeholder — throws)
    ├── errors/
    │   └── ModuleNotLoaded.ts  # Thrown when a module cannot be loaded
    ├── interfaces/
    │   ├── ModuleImporter.ts   # Interface for module import operations
    │   └── ModuleLocator.ts    # Interface for module path resolution
    └── types/
        └── Module.ts           # Module type alias: Record<string, unknown>
```

## Core Concepts

### Three-Layer Architecture

1. **SourcingManager (Facade)** — Abstract base class that coordinates file and module operations. Implements both `FileReader` and `ModuleImporter` interfaces. Provides `filter()`, `exists()`, `read()`, and `import()` methods.

2. **FileManager (Sub-manager)** — Handles all file system operations including path resolution, MIME type detection, content reading, and CRUD operations. Validates all paths to prevent directory traversal attacks.

3. **ImportManager (Sub-manager)** — Handles module loading via dynamic `import()`. Delegates path resolution to a `ModuleLocator`.

### File and Module Sourcing

| Class | Responsibility |
|---|---|
| `SourcingManager` | Abstract facade — coordinates file and module operations, provides `filter()`, `exists()`, `read()`, `import()` |
| `FileManager` | Base file manager — path validation, MIME types, content reading, CRUD operations |
| `LocalFileManager` | Local file system implementation using Node.js `fs` and `glob` |
| `LocalFileSystem` | Node.js file system adapter wrapping `fs`, `path`, `glob`, and `mime-types` |
| `RemoteFileManager` | Remote file system (all operations throw `RemoteFilesNotSupported`) |
| `RemoteFileSystem` | Remote file system stub (all operations throw `RemoteFilesNotSupported`) |
| `File` | Model class with `location`, `type`, `content`, and `size` properties |
| `ImportManager` | Base module importer — wraps dynamic `import()` with error translation |
| `LocalImportManager` | Local module import using `LocalModuleLocator` |
| `LocalModuleLocator` | Resolves filenames to `file://` URLs for local modules |
| `RemoteImportManager` | Remote module import (placeholder — throws `ModuleNotLoaded`) |
| `RemoteModuleLocator` | Remote module path resolution (placeholder — throws `ModuleNotLoaded`) |

### Interfaces

| Interface | Purpose |
|---|---|
| `FileReader` | Defines `filter()`, `exists()`, and `read()` for file reading |
| `FileSystem` | Defines file system operations: `copy`, `delete`, `exists`, `filter`, `isAbsolute`, `isDirectory`, `join`, `read`, `resolve`, `relative`, `normalize`, `mimeType`, `write` |
| `ModuleImporter` | Defines `import()` for module loading |
| `ModuleLocator` | Defines `locate()` for module path resolution |

### Path Validation and Security

`FileManager.getAbsoluteLocation()` validates all paths to prevent directory traversal attacks:

1. Resolves the path to an absolute location
2. Normalizes the path (converts Windows backslashes to POSIX forward slashes)
3. Checks that the normalized relative path does not escape the root (`..` or starting with `../`)
4. Checks that the path does not reference a different root (e.g., different drive letter on Windows)

If validation fails, `InvalidLocation` is thrown with the original filename (not the absolute path) to avoid exposing sensitive filesystem information.

## Error Classes

| Error Class | When Thrown |
|---|---|
| `FileNotFound(filename)` | A requested file does not exist |
| `InvalidLocation(filename)` | A path escapes the root location (directory traversal or different drive) |
| `RemoteFilesNotSupported()` | A remote file system operation is attempted (all operations throw) |
| `ModuleNotLoaded(url, cause)` | A module cannot be loaded (wraps the underlying error via `cause`) |

## Coding Conventions

### File Organization

- **1 file per logical component** (class, interface, or type).
- Shared types live under `src/types/`.
- Interfaces live under `src/interfaces/`.
- Error classes live under `src/errors/`.
- Definition constants live under `src/definitions/`.
- Index files re-export all public members via `export { default as <Name> }` pattern.

### Exports

- **Classes**: `export default` (e.g., `export default class FileManager`).
- **Index files**: Re-export using `export { default as <Name> }` pattern.
- **Types**: Exported via `export default` when shared (e.g., `Module`).
- **Error classes**: `export default` for named error classes.

### Private Fields

- Use JavaScript private syntax (`#`) for all private properties and methods.
- Private fields are declared at the top of the class body.
- Private methods use `#camelCase` naming (e.g., `#validateLocation`, `#rootLocation`).

### Naming

- Class names: `PascalCase` (e.g., `FileManager`, `SourcingManager`, `LocalFileSystem`).
- Private fields: `#camelCase` (e.g., `#rootLocation`, `#fileSystem`, `#validateLocation`).
- Private methods: `#camelCase` (e.g., `#validateLocation`, `#rootLocation`).
- Interface names: `PascalCase` without `I` prefix (e.g., `FileReader`, `FileSystem`).

### Path Normalization

- Windows backslashes are normalized to POSIX forward slashes via `normalize()`.

## Testing Conventions

### Test Structure

- Tests live in `test/` directory.
- Test files are named `<ComponentName>.spec.ts`.
- Use `vitest` with `describe`, `it`, `expect`.
- Fixtures are organized under `test/fixtures/`.

### Current Test Coverage

The package currently tests:

- **FileManager**: Path validation (`getAbsoluteLocation`), MIME type detection (`getType`), and error handling (`getContent` for non-existing files).
- **SourcingManager**: The `filter()` method via a test fixture.

### Fixture Patterns

- **TestFileSystem**: Extends `LocalFileSystem` and overrides methods to return controlled data. Used for testing `FileManager` path resolution and validation.
- **TestSourcingManager**: Extends `SourcingManager` with test-specific implementations. Used for integration-style tests.

### Test Fixtures

| Fixture File | Description |
|---|---|
| `paths.fixture.ts` | POSIX and Windows test paths (inputs and expected outputs) |
| `fileManager.fixture.ts` | Pre-configured `FileManager` instances for POSIX and Windows |
| `sourcingManager.fixture.ts` | Pre-configured `TestSourcingManager` instance |
| `importManager.fixture.ts` | Pre-configured `LocalImportManager` instance |
| `TestFileSystem.ts` | Test file system that overrides key methods |
| `TestSourcingManager.ts` | Test sourcing manager using file and import fixtures |

## Build Commands

| Script | Command | Description |
|---|---|---|
| test | `vitest run` | Run tests |
| test-coverage | `vitest run --coverage` | Run tests with coverage |
| lint | `eslint` | Lint source files |
| build | `tsc -p tsconfig.json` | Compile to `./dist` |
| clean | `shx rm -rf dist` | Remove build artifacts |

## Configuration

- Extends root `tsconfig.json` with `rootDir: ./src` and `outDir: ./dist`.
- Package is `private: true` — it is not published independently.
- TypeScript target: `esnext`, module: `esnext`, moduleResolution: `bundler`.
- Test coverage uses the `v8` provider via `vitest.config.ts`.
- Dependencies: `glob` (14.0.3) for glob pattern matching, `mime-types` (3.0.2) for MIME type detection.

## Key Implementation Details

### Default MIME Type

When `mime-types.lookup()` returns `false` (unknown file type), `FileManager.getType()` returns `'application/octet-stream'` as the default MIME type.

### Glob Pattern Constants

The `Files` definition object provides reusable glob patterns:

```typescript
const Files =
{
    MODULE_PATTERN: '**/*.js',
    RESOURCE_PATTERN: '**/*.json',
    SEGMENT_PATTERN: '**/*.json'
};
```

### Remote File System Placeholder

`RemoteFileSystem` and `RemoteModuleLocator` are intentionally stub implementations. All operations throw `RemoteFilesNotSupported()` or `ModuleNotLoaded()` because remote file/module loading is not yet supported due to security considerations. If remote support is ever needed, a multi-protocol interface would be required.

### Local Module Resolution

`LocalModuleLocator.locate()` converts filenames to `file://` URLs:

- Absolute paths (starting with `/`) are resolved relative to the file manager's root.
- Relative paths are resolved as-is.
- The result is a `file://` URL suitable for dynamic `import()`.

## Workflow

When working with this package:

1. **Read the source**: Understand whether you need file sourcing (`FileManager`) or module sourcing (`ImportManager`).
2. **Follow naming conventions**: Class names `PascalCase`, `#` for private, `camelCase` for methods.
3. **Use workspace aliases**: Import from `@jitar/...` for cross-package dependencies, never relative paths across `packages/`.
4. **Export through index files**: Every public class must be re-exported via `src/index.ts` and the appropriate sub-index file.
5. **Write tests**: Create tests that verify path validation, error handling, and both success and failure paths.
6. **Run `npm run lint`** after making changes.
7. **Run `npm run test`** to verify all tests pass.