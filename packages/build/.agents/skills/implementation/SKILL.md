---
name: implementation
description: Implement new features in the @jitar/build package. Use when adding functionality to the application building process, including source reading, target generation, segmentation, and resource handling.
---

# Implementation — @jitar/build

## Overview

The `@jitar/build` package provides the application building process for the Jitar runtime. It reads TypeScript source code, parses module/segment structures, and generates rewritten JavaScript code for the target folder.

**Two main entry points:**

- **`BuildHelper`** — Generates and returns module and segment code on request (on-demand, lazy generation).
- **`BuildManager`** — Rewrites the whole application to the target folder (full build).

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
│   ├── segment/                ← SegmentReader, MemberLocator, Segment, Segmentation, models, types
│   └── resource/               ← ResourceReader, ResourcesList
├── target/                     ← Target code generation layer
│   ├── application/            ← ApplicationBuilder (orchestrates module + segment builders)
│   ├── module/                 ← Builder, LocalModuleGenerator, RemoteModuleGenerator
│   └── segment/                ← Builder, SegmentGenerator
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
| `Segmentation` | Collection of segments; lookup by segment name or module filename (`getSegment()`, `segments`, `getSegments()`) |
| `Segment` | Holds modules, classes, and procedures for a single segment (`modules`, `classes`, `procedures`) |
| `SegmentModule` | Module context within a segment (tracks imports, members, segmented flag; `imports`, `importsImplementation()`, `hasImplementations()`) |
| `SegmentMember` | Base member type (class or implementation) with `id`, `importKey`, and `fqn` |
| `SegmentClass` | A class declaration within a segment |
| `SegmentProcedure` | A procedure name with its list of `SegmentImplementation`s (`implementations`) |
| `SegmentImplementation` | A function implementation with `access`, `version`, `id`, `importKey`, and the parsed `ESFunction` model (`model`) |
| `ResourceReader` | Reads resource file definitions (JSON lists of resource module filenames) |
| `ResourcesList` | Collection of resource module filenames; checks whether a filename is a resource module |

### Target Layer (`src/target/`)

Generates rewritten JavaScript code for the target folder.

| Component | Responsibility |
| --- | --- |
| `ApplicationBuilder` | Orchestrates building modules and segments in parallel |
| `Builder` (module) | For each module: builds the common module, segment-specific modules, and optionally a remote module |
| `LocalModuleGenerator` | Generates local module code with rewritten imports/exports (handles segmentation, resources) |
| `RemoteModuleGenerator` | Generates remote module code that calls `__run` for cross-segment procedure invocation |
| `Builder` (segment) | Builds `.segment.js` files for each segment |
| `SegmentGenerator` | Generates the segment definition file with runtime imports (`Segment`, `Class`, `Procedure`, `Implementation`, `Version`, etc.) |

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

## Entry Points

### BuildHelper (On-Demand Generation)

Use when you need to generate code for specific modules or segments without rewriting the entire application.

```typescript
const helper = new BuildHelper(configuration);
await helper.readApplication();

// Check if a module exists
if (helper.includesModule('path/to/module.js')) {
    // Generate module code (with optional segment filtering)
    const code = helper.generateModuleCode('path/to/module.js', ['segmentA', 'segmentB']);
    
    // Or generate segment definition code
    const segmentCode = helper.generateSegmentCode('segmentName');
}
```

Key methods:
- `readApplication()` — Reads and parses all source, resource, and segment files into an `Application` model.
- `includesModule(filename)` — Checks if a module exists in the application.
- `generateModuleCode(filename, segmentNames?)` — Generates rewritten module code. Behavior depends on segmentation:
  - **Unsegmented modules** — Returns common module code.
  - **Segmented modules, matching segment** — Returns segment-specific module code.
  - **Segmented modules, no matching segment** — Returns remote module code (calls `__run`).
- `generateSegmentCode(segmentName)` — Generates the `.segment.js` file content. Throws `ApplicationSegmentNotFound` if the segment does not exist.

### BuildManager (Full Application Build)

Use when you need to rewrite the entire application to the target folder.

```typescript
const manager = new BuildManager(configuration, LogLevel.DEBUG);
await manager.build();
```

The `build()` method:
1. Reads all source modules, resource files, and segment definitions.
2. Passes the parsed `Application` model to `ApplicationBuilder`.
3. `ApplicationBuilder` runs `Builder` (module) and `Builder` (segment) in parallel.

**Note:** The `BuildManager` constructor accepts an optional `logLevel` parameter (defaults to `LogLevel.DEBUG`).

## Source Reading Patterns

### Reading Modules

Modules are `.ts`/`.js` files matching `Files.MODULE_PATTERN`. The `ModuleReader`:

1. Loads source code via `FileManager.getContent()`.
2. Parses it using `@jitar/analysis` `Parser` into an `ESModule`.
3. Rewrites import/export locations via `LocationRewriter` (adds `.js`, appends `index.js` for directories).
4. Wraps the result in a `Module` with its relative filename.
5. Collects all modules into a `Repository` for O(1) lookup.

### Reading Resources

Resources are JSON files matching `Files.RESOURCE_PATTERN`. Each resource file contains a JSON array of module filenames. The `ResourceReader`:

1. Parses each JSON file into a `ResourceFile` (string array).
2. Normalizes filenames (adds `.js`, resolves directories to `index.js`).
3. Collects all filenames into a `ResourcesList`.

### Reading Segments

Segments are JSON files matching `Files.SEGMENT_PATTERN`. Each segment file defines which modules export which classes/functions for that segment. The `SegmentReader`:

1. Parses the JSON segment definition.
2. Extracts the segment name from the filename (e.g., `mySegment.json` → `mySegment`).
3. Registers modules from the segment definition.
4. Uses `MemberLocator` to trace re-exports back to their original declarations.
5. Creates `Class` or `Implementation` objects based on the declaration type.

**Note:** The `ApplicationReader.read()` method takes three separate arrays (`moduleFiles`, `resourceFiles`, `segmentFiles`) and returns an `Application` model containing the `ModuleRepository`, `ResourcesList`, and `Segmentation`.

## Target Generation Patterns

### Building Modules

For each module in the application:

1. **Unsegmented modules** — A single rewritten output file overwrites the original.
2. **Segmented modules** — Three types of output:
   - **Common module** — The base module with unsegmented exports (overwrites original).
   - **Segment-specific modules** — One per segment with implementations, named `<module>.<segmentName>.js`.
   - **Remote module** — If the module has segmented procedures, a `<module>.remote.js` is generated.

### LocalModuleGenerator (Local Module Code)

The `LocalModuleGenerator` rewrites imports and exports in the cloned `ESModule`:

1. Clones the original `ESModule` model.
2. Rewrites each import/export item:
   - Skips non-application modules (third-party imports).
   - Rewrites to resources (dynamic import placeholder).
   - Rewrites to application modules with segment sub-extensions.
3. For segmented modules, splits imports into:
   - **Segment-specific imports** — Point to `<module>.<segmentName>.js`.
   - **Remote imports** — Point to `<module>.remote.js`.
   - **Common imports** — Point to `<module>.js` (no sub-extension).

### RemoteModuleGenerator (Remote Module Code)

The `RemoteModuleGenerator` generates code that calls the global `__run` function for cross-segment procedure invocation:

1. Collects all unique implementations from all segments for the module.
2. For each implementation:
   - **Private procedures** — Generate a function that throws `ProcedureNotAccessible`.
   - **Public procedures** — Generate a function that calls `__run(fqn, version, {args}, this)`.
3. Each exported function is assigned a unique ID (`$N`) for runtime matching.

### SegmentGenerator (Segment Definition Files)

The `SegmentGenerator` produces `.segment.js` files that define the segment structure for the runtime:

1. Imports runtime types: `Segment`, `Class`, `Procedure`, `Implementation`, `Version`, `NamedParameter`, `ArrayParameter`, `ObjectParameter`.
2. Imports segmented module exports (classes and implementations).
3. Creates a `Segment` declaration with:
   - `Class` objects with `(fqn, id)`.
   - `Procedure` objects with nested `Implementation` objects containing `(version, access, parameters, id)`.

## File and Module Patterns

The package uses file patterns from `@jitar/sourcing` to discover files:

- `Files.MODULE_PATTERN` — Source module files (`.ts` / `.js`)
- `Files.SEGMENT_PATTERN` — Segment definition files (`.json`)
- `Files.RESOURCE_PATTERN` — Resource definition files (`.json`)

When building, modules without segments produce a single rewritten output. Modules with segments produce three outputs:

1. **Common module** — The base module with unsegmented exports.
2. **Segment-specific modules** — One per segment that has implementations, named `<module>.<segmentName>.js`.
3. **Remote module** — If the module has segmented procedures, a `<module>.remote.js` is generated.

## Sub-Extensions

The `FileHelper.addSubExtension()` method replaces `.js` with `.<subExtension>.js`. This is used to produce:

- `<module>.<segmentName>.js` — Segment-specific module output.
- `<module>.remote.js` — Remote module output.

## Key Implementation Notes

- **Segment files are JSON**: The `SegmentReader` reads JSON definition files that describe which modules export which classes/functions. It uses `MemberLocator` to trace re-exports back to their original declarations.
- **Functions must be async**: Implementation functions declared in segment files must be `async`. An `ESFunction.isAsync` property is checked, and a `FunctionNotAsync` error is thrown otherwise.
- **Access levels**: Default access is `'private'`. Private procedures throw a `ProcedureNotAccessible` error when called from the remote module.
- **Versioning**: Default version is `'0.0.0'`. Each implementation carries a semantic version parsed by `VersionParser`.
- **Id generation**: Each member (class or implementation) receives a unique `$N` identifier used by the runtime to match remote calls to local implementations.
- **The `__run` global**: Remote module generators emit calls to a global `__run(fqn, version, params, this)` function. This function is provided by the Jitar runtime at execution time.
- **Segment modules track imports**: `SegmentModule` exposes an `imports` dictionary and `importsImplementation()` / `hasImplementations()` methods for determining which imports target segmented vs. remote procedures.

## Coding Conventions

Follow the repository-wide [CODING_STANDARDS.md](../../CODING_STANDARDS.md). Additional package-specific notes:

### Class Design

- **Private fields** must use the JavaScript `#` syntax (never `private` keyword).
- **Read-only properties** are exposed via getters with no return type annotation (per CODING_STANDARDS).
- **Constructors** receive dependencies via parameter injection; never instantiate collaborators with `new` inside methods when they could be injected.
- **Generators** follow the "generator" naming convention and expose a single `generate(): string` method (`LocalModuleGenerator`, `RemoteModuleGenerator`, `SegmentGenerator`).
- **Builders** follow the "builder" naming convention and expose a `build(): Promise<void>` method (`Builder` in module and segment layers).
- **Readers** follow the "reader" naming convention and expose async `read(...)` / `readAll(...)` methods.

### Error Handling

- All errors extend `Error` directly (never custom base classes).
- Use the `{ cause }` pattern for error wrapping: `super('message', { cause })`.
- Error classes live in the same logical layer as the code that throws them (e.g., `source/module/errors/`, `target/segment/errors/`).
- Error messages follow the CODING_STANDARDS rules: indefinite articles for indefinite entities, present tense, named definite entities.

#### Error Class Inventory

| Error Class | Location | When Thrown |
| --- | --- | --- |
| `ApplicationModuleNotFound` | `src/errors/` | Module not found when requesting code generation |
| `ApplicationNotRead` | `src/errors/` | Code generation attempted before `readApplication()` |
| `ApplicationSegmentNotFound` | `src/errors/` | Segment not found when requesting segment code |
| `BuildFailed` | `src/errors/` | Any error during the full build process |
| `ReadingModuleFailed` | `src/source/module/errors/` | Failed to parse a source module file |
| `ReadingResourcesFailed` | `src/source/resource/errors/` | Failed to parse a resource definition file |
| `ReadingSegmentFailed` | `src/source/segment/errors/` | Failed to parse a segment definition file |
| `ModuleNotFound` | `src/source/segment/errors/` | Module referenced by segment not found in repository |
| `MissingModuleExport` | `src/source/segment/errors/` | Export key not found in module (re-export chain) |
| `InvalidModuleExport` | `src/source/segment/errors/` | Export is neither a class nor a function |
| `FunctionNotAsync` | `src/source/segment/errors/` | Implementation function is not async |
| `DuplicateImplementation` | `src/source/segment/errors/` | Same (fqn, version) pair found in multiple segments |
| `InvalidFilename` | `src/source/segment/errors/` | Segment filename cannot be extracted |
| `FileNotLoaded` | `src/source/segment/errors/` | Segment file could not be loaded/parsed |
| `BuildingModuleFailed` | `src/target/module/errors/` | Failed to generate module code |
| `BuildingSegmentFailed` | `src/target/segment/errors/` | Failed to generate segment code |
| `RewriteItemFound` | `src/target/module/errors/` | Rewrite item not found in module statements |

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

## Data Flow

```
Source Files (.ts/.js)
    │
    ▼
ModuleReader → ESModule (parsed) → Module (wrapped) → Repository
    │
    ▼
ResourceReader → ResourceFile (JSON) → ResourcesList
    │
    ▼
SegmentReader → SegmentFile (JSON) → Segmentation (with Segment, Class, Procedure, Implementation)
    │
    ▼
Application (repository + resources + segmentation)
    │
    ├── BuildHelper → generateModuleCode() / generateSegmentCode()
    │
    └── BuildManager → ApplicationBuilder
                          ├── Builder (module)
                          │     ├── LocalModuleGenerator (common + segment-specific)
                          │     └── RemoteModuleGenerator
                          └── Builder (segment)
                                └── SegmentGenerator (.segment.js)
```

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

## When to Use This Skill

Use this skill when you need to:

- Add new source reading logic (new file types, new parsing rules).
- Add new target generation logic (new output formats, new code transformations).
- Implement new segmentation features (new segment types, new access controls).
- Add new resource handling features.
- Extend path rewriting or import/export transformation logic.
- Add new error types for specific failure scenarios.
- Implement new utility functions for path manipulation or ID generation.

## Implementation Checklist

When implementing a new feature:

- [ ] Understand which layer the feature belongs to (source, target, or supporting).
- [ ] Follow the naming conventions: "Reader" for reading components, "Builder" or "Generator" for generation components (`LocalModuleGenerator`, `RemoteModuleGenerator`, `SegmentGenerator`).
- [ ] Use dependency injection via constructor parameters; never create collaborators with `new` inside methods.
- [ ] Create error classes in the appropriate `errors/` subdirectory.
- [ ] Follow the `#privateField` syntax for private fields (never `private` keyword).
- [ ] Use inline type imports (`import { type Foo } from 'bar'`).
- [ ] Write tests following the `<name>.spec.ts` convention.
- [ ] Run `npm run test` and `npm run lint` before considering the implementation complete.
- [ ] Update exports in the relevant `index.ts` files.
- [ ] Document new constants in the Definitions table above.