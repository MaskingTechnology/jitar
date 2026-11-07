# @jitar/scheduling — Package Guidelines

## Purpose

This package provides task scheduling functionality for the Jitar runtime. It allows developers to create, manage, and execute recurring tasks at configurable intervals.

## Dependencies

- `@jitar/logging` — `Logger` interface for logging task execution errors

## Architecture

The package is organized into three source files plus a types module:

```
src/
├── index.ts                    # Main entry point — re-exports ScheduledTask and ScheduleManager
├── ScheduleManager.ts          # Central manager — creates, removes, and controls task lifecycle
├── ScheduledTask.ts            # Individual task — handles scheduling, execution, and interval management
└── types/
    └── Task.ts                 # Task type alias: () => Promise<void>
```

### Component Responsibilities

| Component | Responsibility |
|---|---|
| `ScheduleManager` | Public facade — creates, removes, starts, and stops scheduled tasks |
| `ScheduledTask` | Individual task — manages the setTimeout lifecycle, executes the task, and reschedules |
| `Task` | Type alias for an async function with no arguments and no return value |

### ScheduleManager Class

The `ScheduleManager` is the central orchestrator. It accepts a `Logger` in its constructor and provides:

| Method | Description |
|---|---|
| `create(task, interval?)` | Creates a new `ScheduledTask` and registers it internally. Returns the task instance. |
| `remove(scheduledTask)` | Removes a `ScheduledTask` from the manager. No-op if the task is not found. |
| `startAll()` | Starts all registered tasks. |
| `stopAll()` | Stops all registered tasks, clearing all timeouts. |

The manager holds a private array `#scheduledTasks: ScheduledTask[]` and tracks tasks by reference.

### ScheduledTask Class

Each `ScheduledTask` manages a single recurring task:

| Method | Description |
|---|---|
| `start()` | Schedules the next execution using `setTimeout`. |
| `stop()` | Clears the pending timeout, preventing further executions. |

Internal behavior:

- Default interval is **5000ms** (`DEFAULT_INTERVAL`).
- Uses `setTimeout` with `.unref()` to allow the process to exit without waiting.
- After each execution, automatically reschedules the next execution (`#scheduleNextExecution`).
- Task errors are caught and logged via `#logger.warn` — they do not stop the scheduling loop.
- A null guard (`#timeout === null`) prevents execution after `stop()` has been called.

### Task Type

```typescript
type Task = () => Promise<void>;
```

A simple type alias for an async function that takes no arguments and returns nothing.

## Exports

Two items are exported from `src/index.ts`:

| Exported Symbol | Type | Description |
|---|---|---|
| `ScheduledTask` | class | Individual scheduled task with start/stop lifecycle |
| `ScheduleManager` | class | Central manager for creating, removing, and controlling tasks |

## Coding Conventions

### File Organization

- **1 file per logical component** (class or type).
- Shared types live under `src/types/`.
- Index file re-exports all public members.

### Exports

- **Classes**: `export default` (e.g., `export default class ScheduleManager`).
- **Index files**: Re-export using `export { default as <Name> }` pattern.
- **Types**: Exported via `export default` when shared (e.g., `Task`).

### Private Fields

- Use JavaScript private syntax (`#`) for all private properties and methods.
- Private fields are declared at the top of the class body.

### Naming

- Class names: `PascalCase` (e.g., `ScheduleManager`, `ScheduledTask`).
- Private fields: `#camelCase` (e.g., `#scheduledTasks`, `#logger`).
- Private methods: `#camelCase` (e.g., `#scheduleNextExecution`, `#executeTask`).

## Testing Conventions

### Test Structure

- Tests live in `test/` directory.
- Test files are named `<ComponentName>.spec.ts`.
- Use `vitest` with `describe`, `it`, `expect`.

### Current State

The package currently has a placeholder test (`test/dummy.spec.ts`) with a TODO to add real tests. When adding tests:

- Mirror the `src/` directory structure under `test/`.
- Create fixtures for `Logger` mocks if needed.
- Test both success and error paths (e.g., task execution success, task execution failure, start/stop lifecycle).

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

## Key Implementation Details

### Default Interval

The default scheduling interval is **5000ms** (5 seconds). This is defined as a constant `DEFAULT_INTERVAL` in `ScheduledTask.ts`.

### Timeout Management

- `setTimeout` handles the scheduling of task execution.
- `.unref()` is called on the timeout handle to prevent it from keeping the Node.js process alive.
- A null check (`#timeout === null`) in `#scheduleNextExecution` prevents execution after `stop()` has been called.

### Error Handling

- Task execution errors are caught and logged via `this.#logger.warn('Scheduled task failed', error)`.
- Errors do **not** stop the scheduling loop — the task continues to execute at the configured interval.

## Workflow

When working with this package:

1. **Read the source**: Understand the component's role within the package.
2. **Follow naming conventions**: Class names `PascalCase`, `#` for private, `camelCase` for methods.
3. **Use workspace aliases**: Import from `@jitar/logging`, never relative paths across packages.
4. **Export through index files**: Every public class must be re-exported via `src/index.ts`.
5. **Write tests**: Create tests that verify the full task lifecycle (create, start, stop, error handling).
6. **Run `npm run lint`** after making changes.
7. **Run `npm run test`** to verify all tests pass.