# CLI Package Agent Guidelines

## Purpose

The `@jitar/cli` package provides the command-line interface for the Jitar runtime. It parses command-line arguments, routes to the appropriate command handler, and delegates to other packages (`@jitar/build`, `@jitar/init`, `@jitar/runtime`, `@jitar/http`) for actual work.

The single exported entry point is `Cli`, which reads `process.argv`, extracts the command name and arguments, and delegates to `CommandRunner`.

## Dependencies

| Package | Usage |
| --- | --- |
| `@jitar/build` | `BuildManager` — invoked by the `build` command |
| `@jitar/configuration` | `ConfigurationManager`, `RuntimeConfiguration`, `ServiceConfiguration` — loaded by `build` and `start` commands |
| `@jitar/http` | `HttpServer`, `HttpRemoteBuilder`, `HttpConfiguration` — used by the `start` command |
| `@jitar/init` | `InitManager` — invoked by the `init` command |
| `@jitar/logging` | `LogLevel`, `LogLevelParser` — parsed by `build` and `start` commands |
| `@jitar/runtime` | `ServerBuilder` — used by the `start` command |
| `@jitar/sourcing` | `LocalSourcingManager` — used by the `start` command |

## Architecture

src/
├── Cli.ts                    ← Main entry point; reads process.argv, delegates to CommandRunner
├── Command.ts                ← Interface defining name, description, options, execute()
├── CommandRunner.ts          ← Registry of commands; routes by name to the correct handler
├── ArgumentProcessor.ts      ← Parses process.argv into command name + key=value map
├── Option.ts                 ← Type describing a command option (key, required, defaultValue, description)
├── index.ts                  ← Re-exports Cli
├── commands/                 ← Concrete command implementations
│   ├── BuildApp.ts           ← Builds the application (delegates to BuildManager)
│   ├── InitApp.ts            ← Initializes a new project from a template (delegates to InitManager)
│   ├── ShowAbout.ts          ← Prints Jitar information
│   ├── ShowHelp.ts           ← Lists commands or shows details for a specific command
│   ├── ShowVersion.ts        ← Prints the installed version
│   └── StartServer.ts        ← Starts the HTTP server (delegates to ServerBuilder)
└── errors/
    ├── CommandNotFound.ts    ← Thrown when an unknown command is requested
    └── MissingArgument.ts   ← Thrown when a required argument is missing

### Core Infrastructure

| Component | Responsibility |
| --- | --- |
| `Cli` | Entry point. Reads `process.argv` via `ArgumentProcessor`, defaults to `'help'` if no command given, calls `CommandRunner.run()` |
| `Command` | Interface with `name`, `description`, `options` (array of `Option`), and `execute(args: ArgumentProcessor): Promise<void>` |
| `CommandRunner` | Registry holding all commands in a `Set<Command>`. Constructor registers all command instances. `run(name, args)` iterates to find the matching command by `name` and calls `execute()` |
| `ArgumentProcessor` | Extracts the command name from `process.argv[2]` (index 0 = node, 1 = script). Parses remaining args as `key=value` pairs into a `Map<string, string>`. Provides `getRequiredArgument(name)` (throws `MissingArgument` if absent) and `getOptionalArgument(name, defaultValue)` |
| `Option` | Type: `{ key, required, defaultValue?, description }` — describes a command's expected options |

### Commands

| Command | Name | Options | Delegates To |
| --- | --- | --- | --- |
| `ShowHelp` | `help` | `[command]` (optional) — command name to show details for | None (lists all registered commands) |
| `ShowAbout` | `about` | none | None |
| `ShowVersion` | `version` | none | Reads `../package.json` via `createRequire` |
| `InitApp` | `init` | `--name` (required), `--template` (required: `react`, `vue`, `backend`), `--location` (optional, default `'./'`) | `InitManager` from `@jitar/init` |
| `BuildApp` | `build` | `--env-file` (optional), `--config` (optional, default `'jitar.json'`), `--log-level` (optional: `info`, `debug`, `warn`, `error`, `fatal`; default `'info'`) | `BuildManager` from `@jitar/build` |
| `StartServer` | `start` | `--service` (required), `--env-file` (optional), `--config` (optional, default `'jitar.json'`), `--log-level` (optional; default `'info'`) | `ServerBuilder` from `@jitar/runtime`, `HttpServer` from `@jitar/http` |

### Error Classes

| Class | Trigger | Message Pattern |
| --- | --- | --- |
| `CommandNotFound` | Unknown command name passed to `CommandRunner.run()` | ``Command ${name} not found`` |
| `MissingArgument` | `ArgumentProcessor.getRequiredArgument()` called with absent key | ``Missing argument '${name}'`` |

## Coding Conventions

Follow the repository-wide [CODING_STANDARDS.md](../../CODING_STANDARDS.md). Additional package-specific notes:

### Command Interface

- Every command **implements** the `Command` interface.
- `name` and `description` are **readonly public properties** (no getters, per CODING_STANDARDS).
- `options` is a **readonly public property** — an array of `Option` type values.
- `execute(args: ArgumentProcessor): Promise<void>` is the single method; it receives the argument processor and delegates to other packages.

### Argument Processing

- Arguments are parsed as `key=value` pairs from `process.argv` (index 2 onward). The key and value are trimmed.
- `getRequiredArgument(name)` throws `MissingArgument` if the key is not present.
- `getOptionalArgument(name, defaultValue)` returns the value or the provided default.
- The command name is always at `process.argv[COMMAND_INDEX]` where `COMMAND_INDEX = 2`.

### Command Implementation Patterns

- **Info-only commands** (`ShowAbout`, `ShowVersion`): `options = []`, simply print to `console`.
- **Help command** (`ShowHelp`): Receives the `Set<Command>` in its constructor so it can introspect all commands. Supports listing all commands or showing details for a specific one.
- **Delegating commands** (`BuildApp`, `InitApp`, `StartServer`): Extract arguments via `ArgumentProcessor`, construct the delegated package's objects, and call their methods.

### Error Handling

- All errors extend `Error` directly (never custom base classes).
- Error messages follow CODING_STANDARDS: indefinite articles for indefinite entities, present tense, named definite entities.
- Note the `CommandNotFound` message omits quotes around the command name (unlike other errors which wrap values in quotes).

### Code Style

- Allman brace style, with `allowSingleLine: true` for simple single-line cases.
- Open curly braces always go on the next line.
- Use `//` comments only for explaining the *why*, not the *what*.
- Use single quotes for strings. Use backticks with template expressions for concatenation.
- One trailing blank line at EOF.
- Unused parameters should be suppressed with `// eslint-disable-next-line @typescript-eslint/no-unused-vars` when the interface requires them but the implementation does not use them (e.g., `ShowAbout.execute`).

## Testing

- Tests use **Vitest** (configured in `vitest.config.ts` with `v8` coverage provider).
- Run tests: `npm run test`
- Run with coverage: `npm run test-coverage`
- Test file convention: `<name>.spec.ts` placed in `test/` directory.
- Fixtures live in `test/fixtures/` and are re-exported via `test/fixtures/index.ts`.

## Build

- Build this package: `npm run build` (runs `tsc -p tsconfig.json`)
- Clean build artifacts: `npm run clean` (removes `dist/`)
- A full monorepo build: `npm run build:all` (handles inter-package build ordering via Turbo)

## Linting

- Lint: `npm run lint` (uses root `eslint.config.mjs` with `@typescript-eslint`, `eslint-plugin-jitar`)
- Note: `--fix` is not supported; fix issues manually.
- Always run `npm run lint` after modifying TypeScript files.

## Key Implementation Notes

- **Command routing**: `CommandRunner` registers all commands in its constructor. No dynamic imports or reflection — commands are explicitly instantiated and added.
- **Default command**: If no command is provided, `Cli.start()` defaults to `'help'`.
- **Argument format**: CLI arguments use `key=value` syntax (e.g., `--name=myapp`). The `=` separator is required; whitespace around key/value is trimmed.
- **Version resolution**: `ShowVersion` reads the package's own `package.json` via Node's `createRequire` to resolve the version at runtime. Falls back to `'0.0.0'` on failure.
- **Server shutdown**: `StartServer` registers a `SIGINT` handler that calls `httpServer.stop()`. A guard flag (`isShuttingDown`) prevents double-stops.
- **Banner**: `StartServer` prints an ASCII art banner before starting the server.

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
