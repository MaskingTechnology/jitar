# @jitar/http

This file extends the root [`AGENTS.md`](../../AGENTS.md) with package-specific information.

## Purpose

This package provides the HTTP transport layer for the Jitar runtime. It implements HTTP-based communication for both client-side remoting (`HttpRemote`) and server-side hosting (`HttpServer`), enabling procedures to be exposed and invoked over HTTP/HTTPS. The package is private (`"private": true`).

## Exports

All exports come from `src/index.ts` (single entry point).

| Exported Symbol | Type | Description |
|-----------------|------|-------------|
| `HttpConfiguration` | type | Configuration type for `HttpServer` (port, body limit, proxied flag) |
| `HttpRemote` | class | HTTP implementation of the `Remote` interface |
| `HttpRemoteBuilder` | class | `RemoteBuilder` implementation creating `HttpRemote` instances |
| `HttpServer` | class | Express-based HTTP server wrapping a Jitar `Server` |

Not exported (internal only): `FetchHttpClient`, `HttpClient`, `InvalidWorkerId`, and the `definitions/` constants.

## Dependencies

| Package | Usage |
| --- | --- |
| `@jitar/execution` | Core execution types: `Request`, `Response`, `ErrorConverter`, `RunModes` |
| `@jitar/runtime` | Runtime types: `Server`, `ServerResponse`, `ContentTypes`, `AddWorkerRequest` |
| `@jitar/services` | Service interfaces: `Remote`, `RemoteBuilder`, `State` |
| `@jitar/sourcing` | File management: `File` |
| `@jitar/validation` | Validation utilities: `Validator` |
| `express` | HTTP server framework (types from dev dependency `@types/express`) |

The Node.js built-in `node:http` (`Server`) is used for the underlying HTTP listener.

## Package structure

```
src/
├── definitions/                ← Constants and configuration type
│   ├── Defaults.ts             ← Default port, body limit, proxied flag
│   ├── HeaderKeys.ts           ← HTTP header key constants
│   ├── HeaderValues.ts         ← HTTP header value constants
│   ├── HttpConfiguration.ts    ← HttpServer configuration type
│   └── IgnoredHeaderKeys.ts    ← Headers excluded from forwarding
├── errors/
│   └── InvalidWorkerId.ts      ← Thrown on invalid addWorker responses
├── interfaces/
│   └── HttpClient.ts           ← HTTP client contract used by HttpRemote
├── FetchHttpClient.ts          ← Native fetch implementation of HttpClient
├── HttpRemote.ts               ← Client-side Remote implementation
├── HttpRemoteBuilder.ts        ← Builds HttpRemote instances
├── HttpServer.ts               ← Server-side Express hosting
└── index.ts                    ← Public API re-exports
```

## Architecture

### Overview

#### Client-Side: HTTP Remoting

The client-side provides an HTTP-based implementation of the `Remote` interface, enabling procedure calls, file serving, and health checks over HTTP.

##### `HttpRemote`

Implements the `Remote` interface. Key responsibilities:

- **`run(request)`** — Invokes a remote procedure via POST on `/rpc/<fqn>`. Serializes the request arguments as a JSON body, adds Jitar-specific headers (`x-jitar-procedure-version`), and deserializes the response based on `x-jitar-content-type` (falling back to `content-type`). Errors are not thrown here; the status is returned in the `Response`.
- **`provide(filename)`** — Retrieves a static file from the server, inferring the content type from the response headers (defaults to `application/octet-stream`).
- **`isHealthy()` / `getHealth()`** — Health check endpoints (`/health/status`, `/health`).
- **`addWorker(url, procedureNames, trustKey?)`** — Registers a worker on the server, validates the response has a valid `id` field.
- **`reportWorker(id, state)`** — Reports a worker's state.
- **`removeWorker(id)`** — Removes a registered worker.

Error handling: Responses with status codes outside 200–399 trigger an `ErrorConverter` to produce an appropriate error. The `#callRemote` method has a `throwOnError` parameter to control this behavior.

##### `HttpRemoteBuilder`

Implements `RemoteBuilder`. Creates `HttpRemote` instances, optionally accepting a custom `HttpClient` implementation (defaults to `FetchHttpClient`).

##### `FetchHttpClient`

A thin wrapper around the native `fetch` API that implements the `HttpClient` interface.

##### `HttpClient` (interface)

Defines the contract for HTTP clients used by `HttpRemote`:

```typescript
interface HttpClient
{
    execute(url: string, options?: RequestInit): Promise<Response>;
}
```

#### Server-Side: HTTP Hosting

The server-side exposes an Express.js application that handles incoming HTTP requests and routes them to the underlying Jitar `Server`.

##### `HttpServer`

Wraps an Express application and a Jitar `Server`. `start()` starts the Jitar server and then the HTTP listener; `stop()` stops them in reverse order. Key responsibilities:

- **Route setup** — Registers the following routes:
  - `GET /health` — Full health status (JSON)
  - `GET /health/status` — Simple health check (`true`/`false`)
  - `GET/POST/OPTIONS /rpc/*procedure` — Procedure invocation (GET via query parameters, POST via body, OPTIONS performs a dry run via `RunModes.DRY`)
  - `POST /workers` — Add a worker
  - `POST /workers/:id/report` — Report worker state
  - `DELETE /workers/:id` — Remove a worker
  - Fallback (any unmatched request) — File serving (static file provision)

- **Middleware pipeline** — Parses data for requests (JSON and URL-encoded), enforces body size limits, and adds default headers (including `X-Content-Type-Options: nosniff`). Disables Express's `X-Powered-By` header.

- **Request extraction** — Extracts FQN from the URL path, procedure version from headers, query/body arguments, and headers (filtering out connection-specific headers like `connection`, `content-length`, `accept-encoding`, `user-agent`, `keep-alive`). Worker requests are validated with `Validator` (400 on validation errors).

- **Response transformation** — Maps the internal `ServerResponse` to an HTTP response, handling content type mapping (boolean, number, undefined, null → `text/plain`), status codes (302 when a `location` header is present), and result serialization. The original content type is always passed in `x-jitar-content-type`.

##### `HttpConfiguration`

Configuration type for `HttpServer`:

```typescript
type HttpConfiguration = {
    readonly port?: string;       // Default: '3000'
    readonly bodyLimit?: number;  // Default: 200 KB (1024 * 200)
    readonly proxied?: boolean;   // Default: true (when behind a reverse proxy)
};
```

When `proxied` is `false`, the server adds `x-forwarded-proto`, `x-forwarded-host`, and `x-forwarded-for` headers manually.

### Decisions

- **Pluggable HTTP client**: `HttpRemote` depends on the `HttpClient` interface instead of `fetch` directly, so custom clients (and test clients) can be injected via `HttpRemoteBuilder`.
- **Jitar content type header**: The original content type is transported in `x-jitar-content-type` so primitive results (boolean, number, null, undefined) can be restored on the client while being sent as `text/plain`.
- **Proxy-aware by default**: `proxied` defaults to `true`; forwarding headers are only added manually when the server is not behind a reverse proxy.
- **Dry runs over OPTIONS**: `OPTIONS /rpc/*procedure` maps to `RunModes.DRY`.

## Coding Conventions

- **Private fields** — Use the `#` private field syntax (e.g., `readonly #url: string`).
- **Allman brace style** — Opening braces on a new line, except for single-line functions.
- **Default parameters** — Use the `??` nullish coalescing operator with defaults from the `Defaults` constant.
- **No inline ESLint disables** — Do not use `// eslint-disable-next-line` without explicit approval. (The one exception is `TestHttpClient.execute` which uses `@typescript-eslint/no-unused-vars`.)
- **Export style** — Use `export default` for classes, `export { type ... }` for types, and `export { ... }` for named re-exports in `index.ts`.
- **Import ordering** — Standard library imports first, then monorepo packages (`@jitar/*`), then local files.

## Definitions

| File | Description |
|---|---|
| `Defaults` | Default configuration values (port, body limit, proxied flag) |
| `HeaderKeys` | HTTP header key constants (content-type, x-jitar-content-type, x-jitar-procedure-version, etc.) |
| `HeaderValues` | HTTP header value constants (application/json, application/octet-stream, nosniff) |
| `IgnoredHeaderKeys` | Headers to exclude from forwarding (connection, content-length, accept-encoding, user-agent, keep-alive) |
| `HttpConfiguration` | Configuration type for the HTTP server |

## Errors

| Error | When Thrown |
|---|---|
| `InvalidWorkerId` | When `addWorker` receives a response that is not valid JSON or lacks a valid `id` field |

## Testing

Tests use **Vitest** with **v8** coverage provider.

- **`HttpRemote.spec.ts`** — Unit tests for `HttpRemote` using a `TestHttpClient` fixture that maps URLs to predefined `Response` objects.
- **`HttpServer.spec.ts`** — Placeholder tests (server integration requires a running server; currently stubs with `expect(true).toBe(true)`).

### Test Fixtures

- **`TestHttpClient`** — Implements `HttpClient`, returning predefined responses based on the requested URL.
- **`values.fixtures.ts`** — Defines input/output test data, including `Request` objects, `Response` objects, and expected outputs.
- **`httpResponses.fixture.ts`** — Maps URLs to their corresponding `Response` fixtures.

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build with tsc |
| `npm run test` | Run tests with Vitest |
| `npm run test-coverage` | Run tests with coverage |
| `npm run lint` | Lint with ESLint |
| `npm run clean` | Remove `dist/` directory |

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
