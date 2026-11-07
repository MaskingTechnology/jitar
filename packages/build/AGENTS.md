# Build Package Agent Guidelines

## Purpose

The `@jitar/build` package provides the application building process for the Jitar runtime. It reads source code, parses module/segment structures, and generates the target application code.

Two main entry points are exposed:

- **BuildHelper** — Generates and returns module and segment code on request (on-demand, lazy generation).
- **BuildManager** — Rewrites the whole application to the target folder (full build).

## Dependencies

| Package | Usage |
| --- | --- |
| `@jitar/analysis` | ES module parsing (`Parser`, `ESModule`, `ESImport`, `ESExport`, `ESClass`, `ESFunction`, `ESDeclaration`, etc.) |
| `@jitar/configuration` | `RuntimeConfiguration` for source, target, resources, segments paths and build options |
| `@jitar/execution` | `AccessLevels`, `VersionParser` |
| `@jitar/logging` | `Logger`, `LogLevel` |
| `@jitar/sourcing` | `FileManager`, `LocalFileManager`, file patterns (`Files.MODULE_PATTERN`, `Files.SEGMENT_PATTERN`, `Files.RESOURCE_PATTERN`) |

## Architecture

```
src/
├── BuildHelper.ts              ← On-demand code generation entry point
├── BuildManager.ts             ← Full application build entry point
├── ProjectFileManager.ts       ← Aggregates 4 FileManagers + ignore patterns
├── index.ts                    ← Re-exports BuildHelper, BuildManager
├── definitions/                ← Shared constants (Defaults, Files, Keywords, Values)
├── errors/                     ← Package-level error classes
├── source/                     ← Source reading / parsing layer
│   ├── application/            ← ApplicationReader, Application model
│   ├── module/                 ← ModuleReader, LocationRewriter, Module, Repository
│   ├── segment/                ← SegmentReader, MemberLocator, Segment, Segmentation, models
│   └── resource/               ← ResourceReader, ResourcesList
├── target/                     ← Target code generation layer
│   ├── application/            ← ApplicationBuilder (orchestrates module + segment builders)
│   ├── module/                 ← ModuleBuilder, LocalGenerator, RemoteGenerator
│   └── segment/                ← SegmentBuilder, Generator
└── utils/                      ← FileHelper, IdGenerator
```

### Source Layer (`src/source/`)

Reads and parses the application's source files into intermediate models.

| Component | Responsibility |
| --- | --- |
| `ApplicationReader` | Coordinates reading modules, resources, and segments; returns an `Application` model |
| `Application` | Aggregate model holding `ModuleRepository`, `ResourcesList`, and `Segmentation` |
| `ModuleReader` | Parses all module files using `@jitar/analysis` `Parser`; produces `Module` objects |
| `LocationRewriter` | Normalizes import/export paths — adds `.js` extension, appends `index.js` for directories |
| `Module` | Wraps a parsed ES module with its relative filename |
| `Repository` | Collection of modules with O(1) lookup by filename |
| `SegmentReader` | Reads JSON segment definition files and locates class/function implementations via `MemberLocator` |
| `MemberLocator` | Traces re-exports back through the module graph to find the actual class or function declaration |
| `Segmentation` | Collection of segments; lookup by segment name or module filename |
| `Segment` | Holds modules, classes, and procedures for a single segment |
| `SegmentModule` | Module context within a segment (tracks imports, members, segmented flag) |
| `SegmentClass` | A class declaration within a segment |
| `SegmentProcedure` | A procedure name with its list of `SegmentImplementation`s |
| `SegmentImplementation` | A function implementation with `access`, `version`, and the parsed `ESFunction` model |
| `ResourceReader` | Reads resource file definitions (JSON lists of resource module filenames) |
| `ResourcesList` | Collection of resource module filenames; checks whether a filename is a resource module |

### Target Layer (`src/target/`)

Generates rewritten JavaScript code for the target folder.

| Component | Responsibility |
| --- | --- |
| `ApplicationBuilder` | Orchestrates building modules and segments in parallel |
| `ModuleBuilder` | For each module: builds the common module, segment-specific modules, and optionally a remote module |
| `LocalGenerator` | Generates local module code with rewritten imports/exports (handles segmentation, resources) |
| `RemoteGenerator` | Generates remote module code that calls `__run` for cross-segment procedure invocation |
| `SegmentBuilder` | Builds `.segment.js` files for each segment |
| `Generator` | Generates the segment definition file with runtime imports (`Segment`, `Class`, `Procedure`, `Implementation`, `Version`, etc.) |

### Supporting Components

| Component | Responsibility |
| --- | --- |
| `ProjectFileManager` | Aggregates four `FileManager` instances (source, target, resource, segment) and the source ignore patterns |
| `FileHelper` | Path manipulation utilities: `translatePath`, `makePathRelative`, `makePathAbsolute`, `extractPath`, `extractFilename`, `assureExtension`, `addSubExtension`, `isApplicationModule` |
| `IdGenerator` | Simple incrementing ID generator (produces `$1`, `$2`, …) |

### Definitions (Constants)

| File | Contents |
| --- | --- |
| `Defaults.ts` | `ACCESS_LEVEL: 'private'`, `VERSION_NUMBER: '0.0.0'` |
| `Files.ts` | `INDEX: 'index.js'`, `JSON: '.json'` |
| `Keywords.ts` | `DEFAULT: 'default'` |
| `Values.ts` | `ASTERISK: '*'` |


## Coding Conventions

Follow the repository-wide [CODING_STANDARDS.md](../../CODING_STANDARDS.md). Additional package-specific notes:

### Class Design

- **Private fields** must use the JavaScript `#` syntax (never `private` keyword).
- **Read-only properties** are exposed via getters with no return type annotation (per CODING_STANDARDS).
- **Constructors** receive dependencies via parameter injection; never instantiate collaborators with `new` inside methods when they could be injected.
- **Generators** follow the "generator" naming convention and expose a single `generate(): string` method.
- **Readers** follow the "reader" naming convention and expose async `read(...)` / `readAll(...)` methods.

### Error Handling

- All errors extend `Error` directly (never custom base classes).
- Use the `{ cause }` pattern for error wrapping: `super('message', { cause })`.
- Error classes live in the same logical layer as the code that throws them (e.g., `source/module/errors/`, `target/segment/errors/`).
- Error messages follow the CODING_STANDARDS rules: indefinite articles for indefinite entities, present tense, named definite entities.

### Imports

Order follows the repository standard:

1. External dependencies (`@jitar/analysis`, `@jitar/sourcing`, etc.)
2. Internal package dependencies (`../../definitions`, `../module`, etc.)
3. Relative imports within the same directory

Use inline type imports (`import { type ESModule } from '...'`) rather than separate `import type` statements.

### Code Style

- Allman brace style, with `allowSingleLine: true` for simple single-line cases.
- Open curly braces always go on the next line.
- Group logically related statements together; separate groups with blank lines.
- Use `//` comments only for explaining the *why*, not the *what*.
- Use single quotes for strings. Use backticks with template expressions for concatenation.
- One trailing blank line at EOF.

## Testing

- Tests use **Vitest** (configured in `vitest.config.ts` with `v8` coverage provider).
- Run tests: `npm run test`
- Run with coverage: `npm run test-coverage`
- Test file convention: `<name>.spec.ts` placed alongside the source file or in a `test/` directory.

## Build

- Build this package: `npm run build` (runs `tsc -p tsconfig.json`)
- Clean build artifacts: `npm run clean` (removes `dist/`)
- A full monorepo build: `npm run build:all` (handles inter-package build ordering via Turbo)

## Linting

- Lint: `npm run lint` (uses root `eslint.config.mjs` with `@typescript-eslint`, `eslint-plugin-jitar`)
- Note: `--fix` is not supported; fix issues manually.
- Always run `npm run lint` after modifying TypeScript files.


## File and Module Patterns

The package uses file patterns from `@jitar/sourcing` to discover files:

- `Files.MODULE_PATTERN` — Source module files (`.ts` / `.js`)
- `Files.SEGMENT_PATTERN` — Segment definition files (`.json`)
- `Files.RESOURCE_PATTERN` — Resource definition files (`.json`)

When building, modules without segments produce a single rewritten output. Modules with segments produce three outputs:

1. **Common module** — The base module with unsegmented exports.
2. **Segment-specific modules** — One per segment that has implementations, named `<module>.<segmentName>.js`.
3. **Remote module** — If the module has segmented procedures, a `<module>.remote.js` is generated containing `__run` calls.

## Sub-Extensions

The `FileHelper.addSubExtension()` method replaces `.js` with `.<subExtension>.js`. This is used to produce:

- `<module>.<segmentName>.js` — Segment-specific module output.
- `<module>.remote.js` — Remote module output.

## Key Implementation Notes

- **Segment files are JSON**: The `SegmentReader` reads JSON definition files that describe which modules export which classes/functions. It uses `MemberLocator` to trace re-exports back to their original declarations.
- **Functions must be async**: Implementation functions declared in segment files must be `async`. A `FunctionNotAsync` error is thrown otherwise.
- **Access levels**: Default access is `'private'`. Private procedures throw a `ProcedureNotAccessible` error when called from the remote module.
- **Versioning**: Default version is `'0.0.0'`. Each implementation carries a semantic version parsed by `VersionParser`.
- **Id generation**: Each member (class or implementation) receives a unique `$N` identifier used by the runtime to match remote calls to local implementations.
- **The `__run` global**: Remote module generators emit calls to a global `__run(fqn, version, params, this)` function. This function is provided by the Jitar runtime at execution time.

