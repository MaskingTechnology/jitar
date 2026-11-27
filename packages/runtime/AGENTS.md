# @jitar/runtime

This file extends the root [`AGENTS.md`](../../AGENTS.md) with package-specific information.

## Purpose

This package provides the client and server runtimes for Jitar. The `Client` runs procedures from within a (browser or remote) application, connecting to a Jitar server through a remote gateway. The `Server` hosts a configured service (gateway, worker, repository, proxy, or standalone) and exposes transport-agnostic operations (run, provide, health, worker management) that transport layers such as `@jitar/http` map onto routes. Builders (`ClientBuilder`, `ServerBuilder`) assemble both runtimes from configuration. The package is private (`"private": true`).

## Exports

All exports come from `src/index.ts` (single entry point), organized by category (client, server).

| Exported Symbol | Type | Description |
|-----------------|------|-------------|
| `Client` | class | Client runtime class |
| `ClientBuilder` | class | Builds a `Client` from a `RemoteBuilder` and client configuration |
| `ContentTypes` | const | Content type constants |
| `AddWorkerRequest` | type | Worker registration request type |
| `ServerResponse` | type | Server response type |
| `Server` | class | Server runtime class |
| `ServerBuilder` | class | Builds a `Server` from a `ServiceConfiguration` (class is named `RuntimeBuilder` in source) |

## Dependencies

| Package | Usage |
| --- | --- |
| `@jitar/configuration` | `ServiceConfiguration`, `GatewayConfiguration`, `WorkerConfiguration`, `RepositoryConfiguration`, `ProxyConfiguration`, `StandaloneConfiguration` |
| `@jitar/errors` | `BadRequest`, `Forbidden`, `NotFound`, `NotImplemented`, `PaymentRequired`, `Teapot`, `Unauthorized` for status code mapping |
| `@jitar/execution` | `ExecutionManager`, `Segment`, `Class`, `Request`, `Response`, `Runner`, `RunModes`, `RunMode`, `StatusCodes`, `Version`, `VersionParser`, execution error classes |
| `@jitar/health` | `HealthManager` |
| `@jitar/logging` | `Logger`, `LogLevel`, `LogLevels` |
| `@jitar/middleware` | `Middleware`, `MiddlewareManager`, `NextHandler` |
| `@jitar/scheduling` | `ScheduleManager` |
| `@jitar/serialization` | `Serializer`, `SerializerBuilder`, `ClassResolver` |
| `@jitar/services` | `LocalWorker`, `LocalGateway`, `LocalRepository`, `LocalProxy`, `RemoteGateway`, `RemoteRepository`, `RemoteBuilder`, `RemoteWorkerBuilder`, `Remote`, `RequestPool`, `WorkerManager`, `DummyProvider`, `DummyRunner`, `State`, `States` |
| `@jitar/sourcing` | `SourcingManager`, `RemoteSourcingManager`, `File` |

## Package structure

```
src/
├── client/
│   ├── errors/                     ← StartingClientFailed, StoppingClientFailed
│   ├── Client.ts                   ← Client runtime (LocalWorker + RemoteGateway + middleware)
│   └── ClientBuilder.ts            ← Builds a Client from a RemoteBuilder
├── server/
│   ├── definitions/                ← ContentTypes, StatusCodes
│   ├── errors/                     ← StartingServerFailed, StoppingServerFailed, UnknownServiceConfigured
│   ├── types/                      ← Request/response types (RunRequest, AddWorkerRequest, ..., ServerResponse)
│   ├── ResourceManager.ts          ← Runs setUp / tearDown scripts
│   ├── Server.ts                   ← Server runtime (LocalProxy + middleware + resources)
│   └── ServerBuilder.ts            ← Builds a Server from a ServiceConfiguration
├── ExecutionClassResolver.ts       ← ClassResolver backed by an ExecutionManager
├── ProcedureRunner.ts              ← Middleware delegating to a Runner
├── Runtime.ts                      ← Abstract base class for Client and Server
├── jitarSegment.ts                 ← Pre-registered '@jitar' segment with execution errors
└── index.ts                        ← Public API re-exports
```

## Architecture

### Overview

#### Abstract Base: `Runtime`

Both `Client` and `Server` extend the abstract `Runtime` class, which:

- Initializes global functions (`__run`, `ProcedureNotAccessible`) used by remote implementations, decoupling the runtime from specific remote implementations.
- Defines abstract methods: `getTrustKey()` and `runInternal(request)`.
- Provides a private `#run` method that converts FQN-based calls into `Request` objects (copying headers from the source request and adding `X-Jitar-Trust-Key` when a trust key is available) and invokes `runInternal`. Non-OK responses are thrown as their result.

#### Client

The `Client` wraps a `LocalWorker` with a `RemoteGateway` and supports middleware. Key responsibilities:

- **`start()`** / **`stop()`** — Manages lifecycle: starts/stops the worker and middleware manager concurrently via `Promise.all`, and starts/stops the `RequestPool`.
- **`run(request)`** — Delegates to the `MiddlewareManager`, which chains through registered middleware and ultimately the `ProcedureRunner`.
- **`runInternal(request)`** — Executes via a `RequestPool`.
- **`getTrustKey()`** — Returns `undefined` (clients do not provide a trust key).
- **`#setUp()`** — Starts the worker and middleware, then adds a `ProcedureRunner` to the middleware chain.
- **`#tearDown()`** — Stops the middleware and worker concurrently via `Promise.all`.

Configuration requires: `remoteUrl`, `remote`, `healthManager`, `middlewareManager`, `executionManager`, `serializer`, `scheduleManager`.

#### ClientBuilder

Constructs a `Client` from a `RemoteBuilder`. Internal build pipeline:

1. Creates a `Remote` via the `RemoteBuilder`.
2. Creates a `RemoteSourcingManager` for health, middleware, and execution sourcing.
3. Builds a `HealthManager` from the sourcing manager.
4. Builds a `MiddlewareManager` from the sourcing manager, optionally adding user-provided middleware.
5. Builds an `ExecutionManager` from the sourcing manager, optionally adding user-provided segments, and always adding `jitarSegment`.
6. Builds a `Serializer` using an `ExecutionClassResolver` tied to the execution manager.
7. Builds a `ScheduleManager` from a `Logger` (log level defaults to `LogLevels.WARN`).

Configuration accepts: `remoteUrl`, optional `middleware[]`, optional `segments[]`, optional `logLevel`.

#### Server

The `Server` wraps a `LocalProxy` with a configurable runner and provider service. Key responsibilities:

- **`start()`** / **`stop()`** — Manages lifecycle: runs setUp scripts (`ResourceManager`), starts the middleware and proxy concurrently and adds a `ProcedureRunner` to the middleware chain; stopping reverses this and runs tearDown scripts last. Logs startup/shutdown messages (and the RPC procedure names when the runner is a `LocalWorker`).
- **`getTrustKey()`** — Delegates to the proxy's trust key.
- **Request handling** — Exposes one method per operation; the transport layer (e.g. `HttpServer` in `@jitar/http`) maps routes onto them:
  - `/health` → `getHealth()` — Full health status (JSON)
  - `/health/status` → `isHealthy()` — Simple health check (boolean)
  - `/rpc/*procedure` → `run(RunRequest)` — Procedure invocation (validates the FQN, parses the version, runs through middleware)
  - `POST /workers` → `addWorker(AddWorkerRequest)` — Add worker
  - `POST /workers/:id/report` → `reportWorker(ReportWorkerRequest)` — Report worker state
  - `DELETE /workers/:id` → `removeWorker(RemoveWorkerRequest)` — Remove worker
  - `GET /:filename` → `provide(ProvideRequest)` — File provision
- **`runInternal(request)`** — Runs directly on the proxy, bypassing middleware.
- **`#determineStatusCode(error)`** — Maps error types to HTTP-like status codes (BadRequest→400, Forbidden→403, NotFound→404, NotImplemented→501, PaymentRequired→402, Teapot→418, Unauthorized→401, all others→500).
- **`#determineContentType(content)`** — Maps content types (undefined, null, boolean, number, object, string).
- **`#respondHealth(health)`** — Returns health as JSON.
- **`#respondHealthy(healthy)`** — Returns health as boolean.
- **`#respondFile(file)`** — Returns file content.
- **`#respondResponse(response)`** — Returns procedure response.
- **`#respondError(error)`** — Returns error response with appropriate status code.
- **`#respondSuccess(result?)`** — Returns success response.
- **`#unmapHeaders(headers)`** — Converts `Map<string, string>` to `Record<string, string>`.
- **`#extractLocalGatewayFromProxy()`** — Validates proxy runner is a `LocalGateway`.

Configuration requires: `proxy`, `sourcingManager`, `remoteWorkerBuilder`, `resourceManager`, `middlewareManager`, `logger`.

#### ServerBuilder (RuntimeBuilder)

Constructs a `Server` from a `ServiceConfiguration` (constructor takes a `SourcingManager` and a `RemoteBuilder`; `build(configuration, logLevel?)` is async). Supports five service types:

| Configuration Type | Description |
|---|---|
| `GatewayConfiguration` | Gateway mode: uses `DummyProvider` + `LocalGateway` (with a `WorkerManager` for registered workers) |
| `WorkerConfiguration` | Worker mode: uses `DummyProvider` + `LocalWorker` (registers at an optional remote gateway) |
| `RepositoryConfiguration` | Repository mode: uses `LocalRepository` + `DummyRunner` |
| `ProxyConfiguration` | Proxy mode: composites a remote repository + remote gateway |
| `StandaloneConfiguration` | Standalone mode: local repository + local worker |

Build pipeline:

1. Extracts configuration: `setUp`, `tearDown`, `middleware`, `healthChecks`.
2. Creates a `Logger` (uses the `Logger` default level when no `logLevel` is given).
3. Builds a `HealthManager` from health check filenames (with `.js` extension assured).
4. Builds a `ScheduleManager` from the logger.
5. Builds a `LocalProxy` based on the service configuration type (throws `UnknownServiceConfigured` if none matches). For worker-based services this builds an `ExecutionManager` from segment names (mapped to `./<name>.segment.js`), adding `jitarSegment`, and a `Serializer` using an `ExecutionClassResolver`.
6. Builds a `ResourceManager` from setUp/tearDown scripts (with `.js` extension assured).
7. Builds a `MiddlewareManager` from middleware filenames (with `.js` extension assured).
8. Builds a `RemoteWorkerBuilder` with optional `unavailableThreshold` and `stoppedThreshold`.

#### ResourceManager

Manages lifecycle scripts (`setUp` / `tearDown`). On `start()`, imports all setup scripts via the `SourcingManager`. On `stop()`, imports all teardown scripts.

#### ProcedureRunner

A `Middleware` implementation that delegates request handling to a `Runner`. Added to the client's (and server's) middleware chain during setup.

#### ExecutionClassResolver

Implements `ClassResolver` for serialization, mapping classes to their FQN and back via an `ExecutionManager`.

#### jitarSegment

A pre-registered `Segment('@jitar')` that includes all execution-related error types (`ImplementationNotFound`, `InvalidParameterValue`, `InvalidVersionNumber`, `MissingParameterValue`, `ProcedureNotFound`, `UnknownParameter`). Always added to both client and server execution managers.

### Decisions

- **Globals for remote implementations**: `__run` and `ProcedureNotAccessible` are set on `globalThis` so remote implementations can be bundled separately from Jitar.
- **Middleware only on external requests**: `Server.run()` goes through the `MiddlewareManager`; `runInternal()` (used by `__run`) bypasses it.
- **Transport-agnostic server**: `Server` returns plain `ServerResponse` objects; HTTP specifics live in `@jitar/http`.
- **Builders assemble everything**: `Client` and `Server` receive fully built dependencies; all wiring lives in `ClientBuilder` / `ServerBuilder`.

## Coding Conventions

- **Private fields** — Use the `#` private field syntax (e.g., `readonly #url: string`).
- **Allman brace style** — Opening braces on a new line, except for single-line functions.
- **Default parameters** — Use the `??` nullish coalescing operator with defaults.
- **No inline ESLint disables** — Do not use `// eslint-disable-next-line` without explicit approval. (Existing exception: `ProcedureRunner.handle` uses `@typescript-eslint/no-unused-vars`.)
- **Export style** — Use `export default` for classes and constants, `export { default as ... }` for named re-exports in `index.ts`.
- **Import ordering** — Standard library imports first, then monorepo packages (`@jitar/*`), then local files.
- **Type definitions** — Define configuration types as `readonly` record types with optional fields.
- **Error classes** — Always extend `Error` and pass `{ cause }` for the underlying error.
- **Index file** (`src/index.ts`) re-exports all public types organized by category (definitions, client, server).

## Definitions

| File | Description |
|---|---|
| `StatusCodes` | HTTP-like status code constants: `OK` (200), `BAD_REQUEST` (400), `UNAUTHORIZED` (401), `PAYMENT_REQUIRED` (402), `FORBIDDEN` (403), `NOT_FOUND` (404), `TEAPOT` (418), `SERVER_ERROR` (500), `NOT_IMPLEMENTED` (501) |
| `ContentTypes` | Content type constants: `NULL` (`application/null`), `UNDEFINED` (`application/undefined`), `BOOLEAN` (`application/boolean`), `NUMBER` (`application/number`), `JSON` (`application/json`), `TEXT` (`text/plain`) |
| `ServerResponse` | Response type: `{ result: unknown, contentType: string, headers: Record<string, string>, status: number }` |

## Request Types

| File | Description |
|---|---|
| `RunRequest` | Procedure invocation: `{ fqn, version?, args, headers, mode }` |
| `AddWorkerRequest` | Worker registration: `{ url, procedureNames, trustKey? }` |
| `RemoveWorkerRequest` | Worker removal: `{ id }` |
| `ReportWorkerRequest` | Worker state report: `{ id, state }` |
| `ProvideRequest` | File provision: `{ filename }` |

## Error Handling

| Error | When Thrown |
|---|---|
| `StartingClientFailed` | When `Client.start()` fails (wraps the underlying error with `{ cause }`) |
| `StoppingClientFailed` | When `Client.stop()` fails (wraps the underlying error with `{ cause }`) |
| `StartingServerFailed` | When `Server.start()` fails (wraps the underlying error with `{ cause }`) |
| `StoppingServerFailed` | When `Server.stop()` fails (wraps the underlying error with `{ cause }`) |
| `UnknownServiceConfigured` | When `ServerBuilder` cannot match any service type in the configuration |

Operation errors in `Server` (run, provide, health, workers) are not thrown; they are logged and returned as a `ServerResponse` with the mapped status code.

## Testing

Tests use Vitest. The package currently only contains a placeholder test (`test/dummy.spec.ts`).

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build with tsc |
| `npm run test` | Run tests with Vitest |
| `npm run test-coverage` | Run tests with v8 coverage |
| `npm run lint` | Lint with ESLint |
| `npm run clean` | Remove `dist/` directory |

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
