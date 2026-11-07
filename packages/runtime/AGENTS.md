## Architecture

### Abstract Base: `Runtime`

Both `Client` and `Server` extend the abstract `Runtime` class, which:

- Initializes global functions (`__run`, `ProcedureNotAccessible`) used by remote implementations, decoupling the runtime from specific remote implementations.
- Defines abstract methods: `getTrustKey()` and `runInternal(request)`.
- Provides a private `#run` method that converts FQN-based calls into `Request` objects and invokes `runInternal`.

### Client

The `Client` wraps a `LocalWorker` with a `RemoteGateway` and supports middleware. Key responsibilities:

- **`start()`** / **`stop()`** — Manages lifecycle: starts/stops the worker and middleware manager concurrently via `Promise.all`.
- **`run(request)`** — Delegates to the `MiddlewareManager`, which chains through registered middleware and ultimately the `ProcedureRunner`.
- **`runInternal(request)`** — Executes via a `RequestPool`.
- **`getTrustKey()`** — Returns `undefined` (clients do not provide a trust key).
- **`#setUp()`** — Starts the worker and middleware, then adds a `ProcedureRunner` to the middleware chain.
- **`#tearDown()`** — Stops the middleware and worker concurrently via `Promise.all`.

Configuration requires: `remoteUrl`, `remote`, `healthManager`, `middlewareManager`, `executionManager`, `serializer`, `scheduleManager`.

### ClientBuilder

Constructs a `Client` from a `RemoteBuilder`. Internal build pipeline:

1. Creates a `Remote` via the `RemoteBuilder`.
2. Creates a `RemoteSourcingManager` for health, middleware, and execution sourcing.
3. Builds a `HealthManager` from the sourcing manager.
4. Builds a `MiddlewareManager` from the sourcing manager, optionally adding user-provided middleware.
5. Builds an `ExecutionManager` from the sourcing manager, optionally adding user-provided segments, and always adding `jitarSegment`.
6. Builds a `Serializer` using an `ExecutionClassResolver` tied to the execution manager.
7. Builds a `ScheduleManager` from a `Logger`.

Configuration accepts: `remoteUrl`, optional `middleware[]`, optional `segments[]`, optional `logLevel`.

### Server

The `Server` wraps a `LocalProxy` with a configurable runner and provider service. Key responsibilities:

- **`start()`** / **`stop()`** — Manages lifecycle: starts/stops the middleware and proxy, logs startup/shutdown messages.
- **`getTrustKey()`** — Delegates to the proxy's trust key.
- **`handleRequest(request)`** — Routes incoming requests to the appropriate handler:
  - `/health` → Full health status (JSON)
  - `/health/status` → Simple health check (boolean)
  - `/rpc/*procedure` → Procedure invocation via `RunRequest`
  - `POST /workers` → Add worker via `AddWorkerRequest`
  - `POST /workers/:id/report` → Report worker state via `ReportWorkerRequest`
  - `DELETE /workers/:id` → Remove worker via `RemoveWorkerRequest`
  - `GET /:filename` → File provision via `ProvideRequest`
- **`getHealth()`** → Returns aggregated health status.
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
### ServerBuilder (RuntimeBuilder)

Constructs a `Server` from a `ServiceConfiguration`. Supports five service types:

| Configuration Type | Description |
|---|---|
| `GatewayConfiguration` | Gateway mode: uses `DummyProvider` + `LocalGateway` (with optional workers) |
| `WorkerConfiguration` | Worker mode: uses `LocalWorker` with optional workers |
| `RepositoryConfiguration` | Repository mode: uses `LocalRepository` or `RemoteRepository` |
| `ProxyConfiguration` | Proxy mode: composites a remote repository + remote gateway |
| `StandaloneConfiguration` | Standalone mode: local repository + local worker |

Build pipeline:

1. Extracts configuration: `setUp`, `tearDown`, `middleware`, `healthChecks`.
2. Creates a `Logger` (defaults to `LogLevels.WARN`).
3. Builds a `HealthManager` from health check filenames (with `.js` extension assured).
4. Builds a `ScheduleManager` from the logger.
5. Builds a `LocalProxy` based on the service configuration type (throws `UnknownServiceConfigured` if none matches).
6. Builds a `ResourceManager` from setUp/tearDown scripts (with `.js` extension assured).
7. Builds a `MiddlewareManager` from middleware filenames (with `.js` extension assured).
8. Builds an `ExecutionManager` from segment filenames (with `.js` extension assured), adding `jitarSegment`.
9. Builds a `Serializer` using an `ExecutionClassResolver`.
10. Builds a `RemoteWorkerBuilder` with optional `unavailableThreshold` and `stoppedThreshold`.

### ResourceManager

Manages lifecycle scripts (`setUp` / `tearDown`). On `start()`, imports all setup scripts via the `SourcingManager`. On `stop()`, imports all teardown scripts.

### ProcedureRunner

A `Middleware` implementation that delegates request handling to a `Runner`. Added to the client's middleware chain during setup.

### ExecutionClassResolver

Implements `ClassResolver` for serialization, mapping classes to their FQN and back via an `ExecutionManager`.

### jitarSegment

A pre-registered `Segment('@jitar')` that includes all execution-related error types (`ImplementationNotFound`, `InvalidParameterValue`, `InvalidVersionNumber`, `MissingParameterValue`, `ProcedureNotFound`, `UnknownParameter`). Always added to both client and server execution managers.

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

## Public API (index.ts)

| Export | Type |
|---|---|
| `Client` | Named re-export — client class |
| `ClientBuilder` | Named re-export — client builder class |
| `ContentTypes` | Named re-export — content type constants |
| `AddWorkerRequest` | Named re-export — worker registration request type |
| `ServerResponse` | Named re-export — server response type |
| `Server` | Named re-export — server class |
| `ServerBuilder` | Named re-export — server builder class |

## Coding Conventions

- **Private fields** — Use the `#` private field syntax (e.g., `readonly #url: string`).
- **Allman brace style** — Opening braces on a new line, except for single-line functions.
- **Default parameters** — Use the `??` nullish coalescing operator with defaults.
- **No inline ESLint disables** — Do not use `// eslint-disable-next-line` without explicit approval.
- **Export style** — Use `export default` for classes and constants, `export { default as ... }` for named re-exports in `index.ts`.
- **Import ordering** — Standard library imports first, then monorepo packages (`@jitar/*`), then local files.
- **Type definitions** — Define configuration types as `readonly` record types with optional fields.
- **Error classes** — Always extend `Error` and pass `{ cause }` for the underlying error.
- **Index file** (`src/index.ts`) re-exports all public types organized by category (definitions, client, server).

## Build & Test Commands

```bash
npm run build       # Build with tsc
npm run test        # Run tests with Vitest
npm run test-coverage # Run tests with v8 coverage
npm run lint        # Lint with ESLint
npm run clean       # Remove dist/ directory
```
