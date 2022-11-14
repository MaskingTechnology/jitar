
# Jitar Roadmap

This document describes the roadmap for Jitar. It is a living document and will be updated as new features are added or existing features are removed.

Please join our [Discord community](https://discord.gg/Bqwy8azp5R) for feature requests.

## Roadmap to v1.0

* Optimize caching (update changed files only)
* Real development mode (auto-reload on save)
* Build system (combine and minify segment files)
* Authentication / authorization support
* Asset protection (public private assets) [done]
* Add support for (de)serializing binary data [done]
* Data type validation on RPC calls
* Fail on unexpected parameters on RPC calls [done]
* Monitoring (metrics)
* Integrations ([Next.js](https://nextjs.org/), etc.)
* Split Jitar into multiple packages (e.g. `jitar-core`, `jitar-server`, etc.) [done]

## Roadmap beyond v1.0

* Split Jitar into multiple packages (e.g. `jitar-serializer`, etc.)
* Add support for other RPC protocols (e.g. [gRPC](https://grpc.io/))
* Test / add support for other JavaScript runtimes ([Deno](https://deno.land/), [Bun](https://bun.sh/))
* Provide a configurable Docker image
* (more to come ...)
