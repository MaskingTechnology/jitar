# @jitar/services — Agent Guidelines

## Package Overview

This package provides the service layer for the Jitar runtime. It implements:

- **Runner services**: `Worker` (executes procedures locally, delegates to remote gateway) and `Gateway` (routes requests to appropriate workers).
- **Provider services**: `Repository` (stores and serves files by filename).
- **Hybrid services**: `Proxy` (combines runner and provider capabilities).
- **Dummy implementations**: `DummyProvider` and `DummyRunner` for testing.

The package is **private** (`"private": true`) — it is not published and is consumed only by other monorepo packages (e.g., `@jitar/runtime`).

## Architecture

### Domain directories

| Directory | Responsibility |
|---|---|
| `src/common/` | Shared infrastructure: `Remote` (network abstraction), `RemoteBuilder`, `StateManager`, `RequestPool`, `ReportedStateManager`, state definitions, and common errors. |
| `src/gateway/` | Gateway implementations: `LocalGateway` (manages local workers), `RemoteGateway` (delegates to a remote), plus `WorkerManager` (worker registry with procedure routing) and `WorkerBalancer` (round-robin load balancing). |
| `src/worker/` | Worker implementations: `LocalWorker` (executes procedures via `ExecutionManager`, optionally registers at a gateway), `RemoteWorker` (proxies to a remote), `RemoteWorkerBuilder`. |
| `src/repository/` | Repository implementations: `LocalRepository` (serves files from `SourcingManager`), `RemoteRepository` (proxies to a remote). |
| `src/proxy/` | `LocalProxy` — hybrid combining a `ProviderService` and a `RunnerService`. |
| `src/dummy/` | Test doubles: `DummyProvider`, `DummyRunner`. |

### Top-level interfaces

- `Service` — base lifecycle (`start`, `stop`, `state`, `isHealthy`, `getHealth`, `updateState`).
- `ProviderService extends Service` — adds `provide(filename)`.
- `RunnerService extends Runner, Service` — adds procedure management (`getProcedureNames`, `hasProcedure`, `trustKey`).
- `Worker extends RunnerService` — adds `id`, `isAvailable`, `reportState`.
- `Gateway extends RunnerService` — adds worker management (`addWorker`, `reportWorker`, `removeWorker`).
- `Remote` — network-level abstraction for connect/disconnect, run, provide, worker management, and health.

### State machine

All services use `StateManager` with five states: `starting`, `available`, `unavailable`, `stopping`, `stopped`. The `ReportedStateManager` extends this with time-based degradation (unavailable after 6s, stopped after 18s without a report).

### Serialization

The `LocalWorker` handles serialization via the `X-Jitar-Data-Encoding: serialized` header. Incoming requests with this header are deserialized before execution; outgoing (remote) requests always set it.

## Dependencies

### External

| Package | Purpose |
|---|---|
| `@jitar/errors` | Base error classes (`ServerError`, `Unauthorized`, `BadRequest`, `NotFound`, `NotImplemented`). |
| `@jitar/execution` | Core execution types: `Request`, `Response`, `Runner`, `ExecutionManager`, `Procedure`, `Implementation`. |
| `@jitar/health` | `HealthManager` for health checks. |
| `@jitar/scheduling` | `ScheduleManager`, `ScheduledTask` for periodic monitoring/reporting. |
| `@jitar/serialization` | `Serializer` for (de)serializing request/response data. |
| `@jitar/sourcing` | `File`, `SourcingManager`, `FileNotFound` for file serving. |

### Internal workspace references

All intra-monorepo imports use the `@jitar/...` workspace alias. Never use relative paths across `packages/`.

## Development Conventions

- **Private fields**: Use the `#` prefix for all private class fields and methods (enforced by TypeScript).
- **Configuration objects**: Constructors accept a single configuration object with a `Configuration` type, not individual parameters.
- **Interface-first**: Interfaces are defined in their own `.ts` files (e.g., `Worker.ts`, `Gateway.ts`), implementations follow in separate files (e.g., `LocalWorker.ts`).
- **Error classes**: Extend base error types from `@jitar/errors` (e.g., `ServerError`, `Unauthorized`). Package-specific errors live in `src/<domain>/errors/`.
- **State management**: All services embed a `StateManager` (or `ReportedStateManager` for remote workers) and delegate lifecycle methods through it.
- **`eslint-disable-next-line`**: Only used for `@typescript-eslint/no-unused-vars` on unused parameters in interface implementations (e.g., `DummyProvider`, `RemoteGateway`).

## Public API

The package exports the following from `src/index.ts`:

- **Common**: `Remote`, `RemoteBuilder`, `RequestPool`, `States`, `State`
- **Gateway**: `Gateway`, `LocalGateway`, `RemoteGateway`, `WorkerManager`
- **Worker**: `Worker`, `LocalWorker`, `RemoteWorker`, `RemoteWorkerBuilder`
- **Repository**: `LocalRepository`, `RemoteRepository`
- **Proxy**: `LocalProxy`
- **Dummy**: `DummyProvider`, `DummyRunner`
- **Services**: `Service`, `RunnerService`, `ProviderService`

**Not exported** (internal): error classes, `IdGenerator`, state definitions (only `State` type is exported), and fixture utilities.

## Testing

- **Framework**: Vitest with v8 coverage provider.
- **Commands**:
  - `npm run test` — run all tests.
  - `npm run test-coverage` — run with coverage.
- **Test structure**: Tests mirror source directories (`test/gateway/`, `test/worker/`, `test/repository/`). Fixtures are organized in `test/<domain>/fixtures/` with an `index.ts` re-exporting all fixtures.
- **Fixture pattern**: Create pre-configured instances exported as named constants (e.g., `LOCAL_WORKERS.PUBLIC`, `LOCAL_GATEWAYS.PROTECTED`).

## Build and Validation

- **Build**: `npm run build` — runs `tsc -p tsconfig.json`. Outputs to `dist/`.
- **Lint**: `npm run lint` — uses root `eslint.config.mjs` (Allman brace style, semicolons, custom `jitar` plugin rules).
- **Clean**: `npm run clean` — removes `dist/`.

## Constraints and Important Considerations

- **Do not change the package to public.** It is intentionally private.
- **Do not modify the root `tsconfig.json`** from this package — it extends the monorepo root.
- **Trust key validation**: `LocalGateway` rejects workers with mismatched trust keys. `LocalWorker` rejects untrusted requests to non-public procedures. Both throw `Unauthorized`-derived errors.
- **Worker lifecycle**: Workers are assigned UUIDs by `WorkerManager` via `IdGenerator`. They are removed when their state degrades to `STOPPED` during monitoring.
- **Round-robin balancing**: `WorkerBalancer` filters to available workers only, cycling through them. When no workers are available, it throws `NoWorkerAvailable`.
- **Serialization headers**: The `X-Jitar-Data-Encoding` header is managed by `LocalWorker`. Do not modify this without understanding the serialization contract.
- **Avoid adding new top-level exports** without updating `src/index.ts` and considering whether the type should be public.

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.