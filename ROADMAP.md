
# Jitar Roadmap

This document describes the roadmap for Jitar. It is a living document and will be updated as new features are added or existing features are removed.

Please join our [Discord community](https://discord.gg/Bqwy8azp5R) for feature requests.

## Roadmap to v1.0

* Secure data serialisation
* Advanced reflection
* Setup middleware context
* Response caching
* Optimize repository caching (update changed files only)
* Real development mode (auto-reload on save)
* Production mode (combine and minify segment files)
* Authentication / authorization support
* Integrations ([Next.js](https://nextjs.org/), etc.)
* Split Jitar into multiple packages (e.g. `@jitar/core`, `@jitar/nodejs`, `@jitar/plugin-vite`, `jitar`, etc.)

## Roadmap beyond v1.0

* Procedure specific middleware
* Add support for other RPC protocols (e.g. [gRPC](https://grpc.io/))
* Test / add support for other JavaScript runtimes ([Deno](https://deno.land/), [Bun](https://bun.sh/))
* Provide a configurable Docker image
* Monitoring (metrics)
* Data type validation on RPC calls
* Adapters
* (more to come ...)
