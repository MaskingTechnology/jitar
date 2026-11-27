# @jitar/services

This file extends the root [`AGENTS.md`](../../AGENTS.md) with package-specific information.

## Purpose

This package provides the service layer for the Jitar runtime. It implements:

- **Runner services**: `Worker` (executes procedures locally, delegates to remote gateway) and `Gateway` (routes requests to appropriate workers).
- **Provider services**: `Repository` (stores and serves files by filename).
- **Hybrid services**: `Proxy` (combines runner and provider capabilities).
- **Fallback services**: `DummyProvider` and `DummyRunner` — lightweight no-op implementations used by the `Proxy` when a service does not need to provide files or run procedures.

The package is **private** (`"private": true`) — it is not published and is consumed only by other monorepo packages (e.g., `@jitar/runtime`).

## Exports

| Exported Symbol       | Type      | Description |
|-----------------------|-----------|-------------|
| `Remote`              | interface | Network-level abstraction for connect/disconnect, run, provide, worker management, and health |
| `RemoteBuilder`       | interface | Builds a `Remote` for a URL |
| `RequestPool`         | class     | `Runner` that queues requests and limits concurrent execution (default pool size 20) |
| `States`              | object    | Service state constants (`starting`, `available`, `unavailable`, `stopping`, `stopped`) |
| `State`               | type      | Type alias for a valid state string |
| `DummyProvider`       | class     | No-op `ProviderService` |
| `DummyRunner`         | class     | No-op `RunnerService` |
| `Gateway`             | interface | `RunnerService` with worker management (`addWorker`, `reportWorker`, `removeWorker`) |
| `LocalGateway`        | class     | Gateway managing local workers |
| `RemoteGateway`       | class     | Gateway delegating to a remote |
| `WorkerManager`       | class     | Worker registry with procedure routing and monitoring |
| `LocalProxy`          | class     | Hybrid combining a `ProviderService` and a `RunnerService` |
| `LocalRepository`     | class     | Serves files from a `SourcingManager` |
| `RemoteRepository`    | class     | Proxies file requests to a remote |
| `Worker`              | interface | `RunnerService` with `id`, `isAvailable`, `reportState` |
| `LocalWorker`         | class     | Executes procedures via `ExecutionManager`, optionally registers at a gateway |
| `RemoteWorker`        | class     | Proxies to a remote worker |
| `RemoteWorkerBuilder` | class     | Builds `RemoteWorker` instances from a `RemoteBuilder` |
| `Service`             | interface | Base service lifecycle |
| `RunnerService`       | interface | `Runner` + `Service` with procedure management |
| `ProviderService`     | interface | `Service` with `provide(filename)` |

**Not exported** (internal): error classes, `IdGenerator`, `StateManager`, `ReportedStateManager`, `WorkerBalancer`, the `Repository` interface, state definitions (only `States` and the `State` type are exported), and fixture utilities.

## Dependencies

| Package | Usage |
| --- | --- |
| `@jitar/errors` | Base error classes (`ServerError`, `Unauthorized`, `NotImplemented`) |
| `@jitar/execution` | Core execution types: `Request`, `Response`, `Runner`, `ExecutionManager`, `Implementation`, `ProcedureNotFound` |
| `@jitar/health` | `HealthManager` for health checks |
| `@jitar/scheduling` | `ScheduleManager`, `ScheduledTask` for periodic monitoring/reporting |
| `@jitar/serialization` | `Serializer` for (de)serializing request/response data |
| `@jitar/sourcing` | `File`, `SourcingManager`, `FileNotFound` for file serving |

All intra-monorepo imports use the `@jitar/...` workspace alias. Never use relative paths across `packages/`.

## Package structure

```
src/
├── index.ts                    ← Public exports
├── Service.ts                  ← Base service lifecycle interface
├── ProviderService.ts          ← Service + provide(filename)
├── RunnerService.ts            ← Runner + Service + procedure management
├── common/                     ← Shared infrastructure
│   ├── Remote.ts               ← Network abstraction
│   ├── RemoteBuilder.ts
│   ├── RequestPool.ts          ← Concurrency-limited request queue
│   ├── StateManager.ts         ← Service state machine
│   ├── ReportedStateManager.ts ← Time-based state degradation
│   ├── definitions/            ← States
│   └── errors/                 ← RequestCancelled
├── gateway/
│   ├── Gateway.ts              ← Gateway interface
│   ├── LocalGateway.ts         ← Manages local workers
│   ├── RemoteGateway.ts        ← Delegates to a remote
│   ├── WorkerManager.ts        ← Worker registry with procedure routing
│   ├── WorkerBalancer.ts       ← Round-robin load balancing
│   ├── errors/                 ← InvalidTrustKey, NoWorkerAvailable, UnknownWorker
│   └── utils/                  ← IdGenerator
├── worker/
│   ├── Worker.ts               ← Worker interface
│   ├── LocalWorker.ts          ← Executes procedures, handles serialization
│   ├── RemoteWorker.ts
│   ├── RemoteWorkerBuilder.ts
│   └── errors/                 ← RequestNotTrusted
├── repository/
│   ├── Repository.ts           ← Repository interface (extends ProviderService)
│   ├── LocalRepository.ts      ← Serves files from SourcingManager
│   └── RemoteRepository.ts
├── proxy/
│   └── LocalProxy.ts           ← Hybrid provider + runner
└── dummy/
    ├── DummyProvider.ts        ← No-op provider
    └── DummyRunner.ts          ← No-op runner
```

## Architecture

### Overview

#### Domain directories

| Directory | Responsibility |
|---|---|
| `src/common/` | Shared infrastructure: `Remote` (network abstraction), `RemoteBuilder`, `StateManager`, `RequestPool`, `ReportedStateManager`, state definitions, and common errors. |
| `src/gateway/` | Gateway implementations: `LocalGateway` (manages local workers), `RemoteGateway` (delegates to a remote), plus `WorkerManager` (worker registry with procedure routing) and `WorkerBalancer` (round-robin load balancing). |
| `src/worker/` | Worker implementations: `LocalWorker` (executes procedures via `ExecutionManager`, optionally registers at a gateway), `RemoteWorker` (proxies to a remote), `RemoteWorkerBuilder`. |
| `src/repository/` | Repository implementations: `LocalRepository` (serves files from `SourcingManager`), `RemoteRepository` (proxies to a remote). |
| `src/proxy/` | `LocalProxy` — hybrid combining a `ProviderService` and a `RunnerService`. |
| `src/dummy/` | Fallback services: `DummyProvider`, `DummyRunner` — no-op implementations used by the `Proxy` when a service does not need to provide files or run procedures. |

#### Top-level interfaces

- `Service` — base lifecycle (`start`, `stop`, `state`, `isHealthy`, `getHealth`, `updateState`).
- `ProviderService extends Service` — adds `provide(filename)`.
- `RunnerService extends Runner, Service` — adds procedure management (`getProcedureNames`, `hasProcedure`, `trustKey`).
- `Worker extends RunnerService` — adds `id`, `isAvailable`, `reportState`.
- `Gateway extends RunnerService` — adds worker management (`addWorker`, `reportWorker`, `removeWorker`).
- `Repository extends ProviderService` — no additional methods (internal).
- `Remote` — network-level abstraction for connect/disconnect, run, provide, worker management, and health.

#### The Proxy Pattern

Every service is built with an internal `Proxy`. The `Proxy` holds both a `RunnerService` and a `ProviderService`, giving every service a consistent interface with both `run()` and `provide()` endpoints. These endpoints are always implemented and return appropriate status codes.

- **Standalone services** (e.g., a standalone gateway): The `Proxy` contains real runner and provider services that actively handle requests and serve files.
- **Worker services**: The `Proxy` uses `DummyProvider` since workers do not serve files. The runner delegates to a gateway for remote execution.

#### State machine

All services use `StateManager` with five states: `starting`, `available`, `unavailable`, `stopping`, `stopped`. The `ReportedStateManager` extends this with time-based degradation (unavailable after 6s, stopped after 18s without a report; thresholds are configurable via the constructor and `RemoteWorkerBuilder`).

#### Serialization

The `LocalWorker` handles serialization via the `X-Jitar-Data-Encoding: serialized` header. Incoming requests with this header are deserialized before execution (and their response is serialized); the header is removed before execution. Outgoing (remote) requests always set it, and their response is deserialized.

### Decisions

- **Uniform dual interface via the Proxy**: This pattern keeps service construction simple and uniform — all services expose the same dual interface regardless of whether they actually provide or run anything.
- **Dummy fallbacks over optional services**: `DummyProvider`/`DummyRunner` fill unused roles so `run()`/`provide()` are always available.
- **Time-based degradation for remote workers**: `ReportedStateManager` derives state from the time since the last report instead of requiring explicit stop messages.
- **Trust keys**: `LocalGateway` rejects workers with mismatched trust keys; `LocalWorker` rejects untrusted requests to non-public procedures.
- **Round-robin balancing**: `WorkerBalancer` cycles through available workers only.

## Coding Conventions

- **Private fields**: Use the `#` prefix for all private class fields and methods (enforced by TypeScript).
- **Configuration objects**: Constructors accept a single configuration object with a `Configuration` type, not individual parameters (utility classes such as `RequestPool`, `WorkerManager`, `ReportedStateManager`, and `RemoteWorkerBuilder` take plain parameters).
- **Interface-first**: Interfaces are defined in their own `.ts` files (e.g., `Worker.ts`, `Gateway.ts`), implementations follow in separate files (e.g., `LocalWorker.ts`).
- **Error classes**: Extend base error types from `@jitar/errors` (e.g., `ServerError`, `Unauthorized`). Package-specific errors live in `src/<domain>/errors/`.
- **State management**: All services embed a `StateManager` (or `ReportedStateManager` for remote workers) and delegate lifecycle methods through it.
- **`eslint-disable-next-line`**: Only used for `@typescript-eslint/no-unused-vars` on unused parameters in interface implementations (e.g., `DummyProvider`, `DummyRunner`, `RemoteGateway`). `Repository.ts` additionally uses a file-level `eslint-disable` for `@typescript-eslint/no-empty-object-type`.

## Testing

- **Framework**: Vitest with v8 coverage provider.
- **Commands**:
  - `npm run test` — run all tests.
  - `npm run test-coverage` — run with coverage.
- **Test structure**: Tests mirror source directories (`test/gateway/`, `test/worker/`, `test/repository/`). Fixtures are organized in `test/<domain>/fixtures/` with an `index.ts` re-exporting all fixtures.
- **Fixture pattern**: Create pre-configured instances exported as named constants (e.g., `LOCAL_WORKERS.PUBLIC`, `LOCAL_GATEWAYS.PROTECTED`).

## Constraints and Important Considerations

- **Do not change the package to public.** It is intentionally private.
- **Do not modify the root `tsconfig.json`** from this package — it extends the monorepo root.
- **Trust key validation**: `LocalGateway` rejects workers with mismatched trust keys. `LocalWorker` rejects untrusted requests to non-public procedures. Both throw `Unauthorized`-derived errors.
- **Worker lifecycle**: Workers are assigned UUIDs by `WorkerManager` via `IdGenerator`. They are removed when their state degrades to `STOPPED` during monitoring.
- **Round-robin balancing**: `WorkerBalancer` filters to available workers only, cycling through them. When no workers are available, it throws `NoWorkerAvailable`.
- **Serialization headers**: The `X-Jitar-Data-Encoding` header is managed by `LocalWorker`. Do not modify this without understanding the serialization contract.
- **Avoid adding new top-level exports** without updating `src/index.ts` and considering whether the type should be public.

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the package (`tsc -p tsconfig.json`), outputs to `dist/` |
| `npm run lint` | Lint the package using root `eslint.config.mjs` (Allman brace style, semicolons, custom `jitar` plugin rules) |
| `npm run test` | Run all tests (`vitest run`) |
| `npm run test-coverage` | Run tests with coverage report |
| `npm run clean` | Remove `dist/` directory |

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
