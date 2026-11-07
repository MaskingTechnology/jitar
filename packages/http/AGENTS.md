# HTTP Package

## Purpose

This package provides the HTTP transport layer for the Jitar runtime. It implements HTTP-based communication for both client-side remoting (`HttpRemote`) and server-side hosting (`HttpServer`), enabling procedures to be exposed and invoked over HTTP/HTTPS.

## Dependencies

| Dependency | Purpose |
|---|---|
| `@jitar/execution` | Core execution types: `Request`, `Response`, `ErrorConverter`, `RunModes`, `Version` |
| `@jitar/runtime` | Runtime types: `Server`, `ServerResponse`, `ContentTypes` |
| `@jitar/services` | Service interfaces: `Remote`, `RemoteBuilder`, `State` |
| `@jitar/sourcing` | File management: `File` |
| `@jitar/validation` | Validation utilities: `Validator` |
| `express` (5.3.0) | HTTP server framework |

## Architecture

### Client-Side: HTTP Remoting

The client-side provides an HTTP-based implementation of the `Remote` interface, enabling procedure calls, file serving, and health checks over HTTP.

#### `HttpRemote`

Implements the `Remote` interface. Key responsibilities:

- **`run(request)`** — Invokes a remote procedure via POST (or GET via OPTIONS). Serializes the request, adds Jitar-specific headers (`x-jitar-procedure-version`), and deserializes the response based on `x-jitar-content-type`.
- **`provide(filename)`** — Retrieves a static file from the server, inferring the content type from the response headers (defaults to `application/octet-stream`).
- **`isHealthy()` / `getHealth()`** — Health check endpoints (`/health/status`, `/health`).
- **`addWorker(url, procedureNames, trustKey?)`** — Registers a worker on the server, validates the response has a valid `id` field.
- **`reportWorker(id, state)`** — Reports a worker's state.
- **`removeWorker(id)`** — Removes a registered worker.

Error handling: Responses with status codes outside 200–399 trigger an `ErrorConverter` to produce an appropriate error. The `#callRemote` method has a `throwOnError` parameter to control this behavior.

#### `HttpRemoteBuilder`

Implements `RemoteBuilder`. Creates `HttpRemote` instances, optionally accepting a custom `HttpClient` implementation (defaults to `FetchHttpClient`).

#### `FetchHttpClient`

A thin wrapper around the native `fetch` API that implements the `HttpClient` interface.

#### `HttpClient` (interface)

Defines the contract for HTTP clients used by `HttpRemote`:

```typescript
interface HttpClient
{
    execute(url: string, options?: RequestInit): Promise<Response>;
}
```

### Server-Side: HTTP Hosting

The server-side exposes an Express.js application that handles incoming HTTP requests and routes them to the underlying Jitar `Server`.

#### `HttpServer`

Wraps an Express application and a Jitar `Server`. Key responsibilities:

- **Route setup** — Registers the following routes:
  - `GET /health` — Full health status (JSON)
  - `GET /health/status` — Simple health check (`true`/`false`)
  - `GET/POST/OPTIONS /rpc/*procedure` — Procedure invocation (GET via query parameters, POST via body)
  - `POST /workers` — Add a worker
  - `POST /workers/:id/report` — Report worker state
  - `DELETE /workers/:id` — Remove a worker
  - Fallback `GET /*` — File serving (static file provision)

- **Middleware pipeline** — Validates `Content-Type` for POST requests, enforces body size limits, and adds default headers (including `X-Content-Type-Options: nosniff`). Disables Express's `X-Powered-By` header.

- **Request extraction** — Extracts FQN from the URL path, procedure version from headers, query/body arguments, and headers (filtering out connection-specific headers like `connection`, `content-length`, `accept-encoding`, `user-agent`, `keep-alive`).

- **Response transformation** — Maps the internal `ServerResponse` to an HTTP response, handling content type mapping (boolean, number, undefined, null → `text/plain`), status codes, and result serialization.

#### `HttpConfiguration`

Configuration type for `HttpServer`:

```typescript
type HttpConfiguration = {
    readonly port?: string;       // Default: '3000'
    readonly bodyLimit?: number;  // Default: 200 KB (1024 * 200)
    readonly proxied?: boolean;   // Default: true (when behind a reverse proxy)
};
```

When `proxied` is `false`, the server adds `x-forwarded-proto`, `x-forwarded-host`, and `x-forwarded-for` headers manually.

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

## Coding Conventions

- **Private fields** — Use the `#` private field syntax (e.g., `readonly #url: string`).
- **Allman brace style** — Opening braces on a new line, except for single-line functions.
- **Default parameters** — Use the `??` nullish coalescing operator with defaults from the `Defaults` constant.
- **No inline ESLint disables** — Do not use `// eslint-disable-next-line` without explicit approval. (The one exception is `TestHttpClient.execute` which uses `@typescript-eslint/no-unused-vars`.)
- **Export style** — Use `export default` for classes, `export { type ... }` for types, and `export { ... }` for named re-exports in `index.ts`.
- **Import ordering** — Standard library imports first, then monorepo packages (`@jitar/*`), then local files.

## Build & Test Commands

```bash
npm run build       # Build with tsc
npm run test        # Run tests with Vitest
npm run test-coverage # Run tests with coverage
npm run lint        # Lint with ESLint
npm run clean       # Remove dist/ directory
```