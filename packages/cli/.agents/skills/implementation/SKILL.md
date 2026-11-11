# CLI Package Implementation Guide

## Purpose

The `@jitar/cli` package provides the command-line interface for the Jitar runtime. It parses command-line arguments, routes to the appropriate command handler, and delegates to other packages (`@jitar/build`, `@jitar/init`, `@jitar/runtime`, `@jitar/http`) for actual work.

The single exported entry point is `Cli`, which reads `process.argv`, extracts the command name and arguments, and delegates to `CommandRunner`.

## Architecture

```
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
```

## Core Components

### Cli (Entry Point)

- **File**: `src/Cli.ts`
- Uses private fields (`#argumentProcessor`, `#commandRunner`) for encapsulation.
- Constructor instantiates `ArgumentProcessor` with `process.argv` and creates a `CommandRunner`.
- `start()` method:
  1. Gets the command name from `ArgumentProcessor.getCommand()`.
  2. Defaults to `'help'` if no command is provided (i.e., `undefined`).
  3. Calls `CommandRunner.run(commandName, argumentProcessor)`.

### Command Interface

- **File**: `src/Command.ts`
- Defines the contract all commands must implement:
  - `readonly name: string` — the command identifier used for routing.
  - `readonly description: string` — human-readable description.
  - `readonly options: Option[]` — array describing expected CLI options.
  - `execute(args: ArgumentProcessor): Promise<void>` — performs the command logic.

### CommandRunner (Command Registry)

- **File**: `src/CommandRunner.ts`
- Maintains a private `Set<Command>` (`#commands`).
- Constructor **explicitly instantiates** all commands and adds them to the set (no dynamic imports or reflection):
  - `ShowHelp` — receives the `#commands` Set in its constructor for introspection.
  - `ShowAbout`
  - `ShowVersion`
  - `InitApp`
  - `BuildApp`
  - `StartServer`
- `run(name, args)` iterates through the set to find a matching command by `name` and calls `execute()`.
- Throws `CommandNotFound(name)` if no matching command is found.

### ArgumentProcessor (Argument Parsing)

- **File**: `src/ArgumentProcessor.ts`
- Uses a constant `COMMAND_INDEX = 2` (index 0 = node, index 1 = script path).
- Extracts the command name from `args[COMMAND_INDEX]`.
- Parses remaining args (`args.slice(COMMAND_INDEX + 1)`) as `key=value` pairs using `split('=')`.
- Keys and values are trimmed of whitespace.
- Provides:
  - `getCommand(): string | undefined` — returns the command name.
  - `containsKey(key: string): boolean` — checks if a key exists in the parsed args.
  - `getRequiredArgument(name: string): string` — throws `MissingArgument` if the key is absent.
  - `getOptionalArgument<T>(name: string, defaultValue: T): T` — returns the value or the provided default.

### Option Type

- **File**: `src/Option.ts`
- A simple type describing a command's expected options:
  ```typescript
  type Option =
  {
      readonly key: string;
      readonly required: boolean;
      readonly defaultValue?: unknown;
      readonly description: string;
  };
  ```


## Commands

| Command | Class | Name | Options | Delegates To |
| --- | --- | --- | --- | --- |
| Info-only | `ShowAbout` | `'about'` | `[]` | None — prints static information |
| Help | `ShowHelp` | `'help'` | `[command]` (optional) | None — introspects all registered commands |
| Version | `ShowVersion` | `'version'` | `[]` | Reads `../package.json` via `createRequire` |
| Initialize | `InitApp` | `'init'` | `--name` (required), `--template` (required: `react`, `vue`, `backend`), `--location` (optional, default `'./'`) | `InitManager` from `@jitar/init` |
| Build | `BuildApp` | `'build'` | `--env-file` (optional), `--config` (optional, default `'jitar.json'`), `--log-level` (optional: `info`, `debug`, `warn`, `error`, `fatal`; default `'info'`) | `BuildManager` from `@jitar/build` |
| Start | `StartServer` | `'start'` | `--service` (required), `--env-file` (optional), `--config` (optional, default `'jitar.json'`), `--log-level` (optional; default `'info'`) | `ServerBuilder` from `@jitar/runtime`, `HttpServer` from `@jitar/http` |

### Command Implementation Patterns

1. **Info-only commands** (`ShowAbout`, `ShowVersion`): `options = []`, simply print to `console`.
2. **Help command** (`ShowHelp`): Receives the `Set<Command>` in its constructor so it can introspect all commands. Supports listing all commands or showing details for a specific one. Uses `LABEL_PADDING = 3` for formatted output alignment.
3. **Delegating commands** (`BuildApp`, `InitApp`, `StartServer`): Extract arguments via `ArgumentProcessor`, construct the delegated package's objects, and call their methods.

### Command Details

#### ShowHelp
- Receives `Set<Command>` in constructor for introspection.
- `execute()` checks if any registered command name matches an argument key.
- If matched, calls `#showCommandDetails(command)` to display that command's options.
- Otherwise, calls `#listCommands()` to display all commands.
- Uses `#determinePaddingSize()` for aligned output formatting.

#### ShowVersion
- Uses `node:module`'s `createRequire` to resolve `../package.json` at runtime.
- Falls back to `'0.0.0'` (constant `UNKNOWN_VERSION`) if resolution fails.
- Prints version as `v<versionNumber>`.

#### InitApp
- Options: `--name` (required), `--template` (required), `--location` (optional, default `'./'`).
- Prints startup message, calls `InitManager.init(projectName, templateName)`, then prints next steps.

#### BuildApp
- Options: `--env-file` (optional), `--config` (optional, default `'jitar.json'`), `--log-level` (optional, default `'info'`).
- Parses log level via `LogLevelParser`.
- Uses `ConfigurationManager` to load environment and runtime configuration.
- Calls `BuildManager.build()`.

#### StartServer
- Options: `--service` (required), `--env-file` (optional), `--config` (optional, default `'jitar.json'`), `--log-level` (optional; default `'info'`).
- Prints an ASCII art banner before starting.
- Builds server using `ServerBuilder` with `LocalSourcingManager` and `HttpRemoteBuilder`.
- Registers a `SIGINT` handler with a guard flag (`isShuttingDown`) to prevent double-stops.

## Error Classes

| Class | Trigger | Message Pattern |
| --- | --- | --- |
| `CommandNotFound` | Unknown command name passed to `CommandRunner.run()` | ``Command ${name} not found`` |
| `MissingArgument` | `ArgumentProcessor.getRequiredArgument()` called with absent key | ``Missing argument '${name}'`` |

- Both extend `Error` directly (never custom base classes).
- `CommandNotFound` message omits quotes around the command name (unlike `MissingArgument` which wraps the name in single quotes).

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

## Key Implementation Notes

- **Command routing**: `CommandRunner` registers all commands in its constructor. No dynamic imports or reflection — commands are explicitly instantiated and added.
- **Default command**: If no command is provided, `Cli.start()` defaults to `'help'`.
- **Argument format**: CLI arguments use `key=value` syntax (e.g., `--name=myapp`). The `=` separator is required; whitespace around key/value is trimmed.
- **Version resolution**: `ShowVersion` reads the package's own `package.json` via Node's `createRequire` to resolve the version at runtime. Falls back to `'0.0.0'` on failure.
- **Server shutdown**: `StartServer` registers a `SIGINT` handler that calls `httpServer.stop()`. A guard flag (`isShuttingDown`) prevents double-stops.
- **Banner**: `StartServer` prints an ASCII art banner before starting the server.

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
