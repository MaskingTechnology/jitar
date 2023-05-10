
# Jitar Roadmap

This document describes the roadmap for Jitar. It is a living document and will be updated as new features are added or existing features are removed.

Please join our [Discord community](https://discord.gg/Bqwy8azp5R) for feature requests.

## Roadmap to v1.0

* Procedure specific middleware [#237](https://github.com/MaskingTechnology/jitar/issues/237)
* Optimize repository caching (update changed files only) [#244](https://github.com/MaskingTechnology/jitar/issues/244)
* Development mode (auto-reload on save) [#245](https://github.com/MaskingTechnology/jitar/issues/245)
* Production mode (combine and minify segment files) [#246](https://github.com/MaskingTechnology/jitar/issues/246)
* Authentication / authorization support [#147](https://github.com/MaskingTechnology/jitar/issues/147)

## Roadmap beyond v1.0

* Response caching [#72](https://github.com/MaskingTechnology/jitar/issues/72)
* Add support for other RPC protocols (e.g. [gRPC](https://grpc.io/))
* Test / add support for other JavaScript runtimes ([Deno](https://deno.land/), [Bun](https://bun.sh/))
* Provide a configurable Docker image
* Monitoring (metrics)
* Data type validation on RPC calls
* Adapters
* Complete CORS support (e.g. Access-Control-Allow-Credentials, Access-Control-Expose-Headers, ...)
* Support for different load balancing strategies (e.g. weighted round-robin, least connections, ...)
* (more to come ...)
