# Logging Package Agent Guidelines

## Package Overview

This package provides a lightweight, extensible logging library for the [Jitar](https://jitar.dev) runtime. It offers:

- **Level-based filtering**: Log levels (DEBUG, INFO, WARN, ERROR, FATAL) with numeric comparison for filtering.
- **Message formatting**: Automatic timestamp injection (`[ISO-8601][LEVEL]`) and intelligent value interpretation (strings, numbers, booleans, objects, arrays, functions, `undefined`, `null`, `Error` objects).
- **Writer abstraction**: A `Writer` interface that decouples log output from the logger, enabling testability and custom sinks (e.g., console, file, network).

## Source Structure

```
src/
├── index.ts                     # Public API exports
├── Logger.ts                    # Core logging class
├── Writer.ts                    # Writer interface
├── definitions/
│   └── LogLevel.ts              # LogLevels const + LogLevel type
├── errors/
│   └── InvalidLogLevel.ts       # Custom error for invalid log level strings
└── utils/
    └── LogLevelParser.ts        # String-to-LogLevel parser
```

### Key Files

| File | Responsibility |
|---|---|
| `src/index.ts` | Re-exports `LogLevel`, `LogLevels`, `Logger`, `LogLevelParser`, and `Writer`. |
| `src/Logger.ts` | Main class. Accepts a `LogLevel` (default: `INFO`) and a `Writer` (default: `console`). Formats messages with `[timestamp][LEVEL]` prefix. |
| `src/Writer.ts` | Interface defining `log`, `debug`, `info`, `warn`, `error` methods. |
| `src/definitions/LogLevel.ts` | Defines `LogLevels` as a `const` object (`DEBUG: 0` through `FATAL: 4`) and derives the `LogLevel` type from it. |
| `src/errors/InvalidLogLevel.ts` | Custom `Error` subclass thrown when `LogLevelParser.parse` receives an unrecognized level string. |
| `src/utils/LogLevelParser.ts` | Parses a string (case-insensitive) into a `LogLevel`. Throws `InvalidLogLevel` for unrecognized values. |

## Design Decisions

- **Numeric log levels**: Levels are numbers (`0`–`4`) rather than strings, enabling simple `>` comparison for filtering.
- **`fatal` maps to `error` writer**: The `Logger.fatal()` method calls `writer.error()` because there is no `writer.fatal()`. This ensures fatal messages are always visible.
- **No `null` values**: The codebase uses `undefined` exclusively (per CODING_STANDARDS.md). `null` is handled as a special case in message formatting.
- **Private fields via `#`**: All private state and methods use the JavaScript `#` syntax (CODING_STANDARDS.md).
- **Default writer is `console`**: When no writer is provided, the logger falls back to the global `console` object, which satisfies the `Writer` interface.

## Coding Conventions

Follow the monorepo-wide [CODING_STANDARDS.md](../../CODING_STANDARDS.md). Additional package-specific notes:

- **1 file per logical component**: Each class, interface, or error gets its own file.
- **Do not export types unless shared**: `LogLevel` and `LogLevels` are exported because they are consumed by `Logger` and `LogLevelParser`. `Writer` is exported because it is a public abstraction users may implement.
- **Private methods use `#`**: E.g., `#createMessage`, `#interpretValue`, `#interpretObject`, `#indent`.
- **Imports order**: External dependencies first (none in this package), then core (parent package types), then runtime types (e.g., `Writer` interface).
- **Brace style**: Allman style with `allowSingleLine: true` per the eslint config.
- **String literals**: Single quotes for string literals; backticks for template literals with interpolations.

## Testing

Tests live under `test/` mirroring the `src/` structure:

```
test/
├── Logger.spec.ts               # Comprehensive Logger tests (level filtering, message formatting)
├── utils/
│   └── LogLevelParser.spec.ts   # LogLevelParser unit tests
└── fixtures/
    ├── index.ts                 # Barrel export for fixtures
    ├── loggers.fixture.ts       # Pre-configured Logger instances per level
    ├── values.fixture.ts        # Input/expected output fixtures for message formatting
    └── writer.fixture.ts        # MemoryWriter mock implementing Writer
```

### Fixture Patterns

- **`MemoryWriter`** (`test/fixtures/writer.fixture.ts`): A test double implementing `Writer` that collects messages in an array. Exposes `messages`, `lastMessage`, and `clear()` for test isolation.
- **`LOGGERS`** (`test/fixtures/loggers.fixture.ts`): Pre-configured `Logger` instances, one per log level, all wired to the `MemoryWriter`.
- **`INPUT` / `OUTPUT`** (`test/fixtures/values.fixture.ts`): Input values and their expected regex-matched output strings for message formatting tests.

### Running Tests

```bash
npm run test           # Run all tests
npm run test-coverage  # Run with v8 coverage
```

## Build & Development

```bash
npm run build    # Compile to dist/
npm run clean    # Remove dist/
npm run lint     # ESLint check
```

Always run `npm run lint` after making changes. A full `npm run build:all` must pass before merging.

## Extending the Logger

To add a new log level:

1. Add the level to `LogLevels` in `src/definitions/LogLevel.ts` with the next numeric value.
2. Add a corresponding method to `Logger.ts` that checks against the new level and calls the appropriate `writer` method.
3. Add the level string case to `LogLevelParser.parse()`.
4. Update test fixtures in `test/fixtures/loggers.fixture.ts` and add corresponding tests.

To provide a custom writer:

1. Implement the `Writer` interface (define `log`, `debug`, `info`, `warn`, `error` methods).
2. Pass the custom writer to the `Logger` constructor.