---
layout: doc

prev:
    text: Building blocks
    link: /fundamentals/building-blocks

next:
    text: Application structure
    link: /develop/application-structure

---

# Runtime services

Jitar holds multiple types of services needed for orchestrating and executing distributed applications. Depending on your needs one or more Jitar instances can be used for running your application. 

In this section you'll learn the available service types, what they do, when to use them and how to configure them.

## Basic configuration

At the start of a Jitar instance, a configuration needs to be given telling the instance what service it needs to provide.

Configurations are placed in JSON files. The basic structure looks like this.

```json
{
    "url": "SERVICE_URL",
    "setUp": ["SET_UP_SCRIPT"],
    "tearDown": ["TEAR_DOWN_SCRIPT"],
    "healthChecks": ["HEALTH_CHECK_SCRIPT"],
    "middlewares": ["MIDDLEWARE_SCRIPT"],
    "SERVICE_TYPE":
    {
        "PROPERTY_1": "…",
        "PROPERTY_2": "…"
    }
}
```

::: tip NOTE
The configuration also supports environment variables. They can be used by wrapping the variable name in `${}`. For example, `${ENVIRONMENT_VARIABLE_1}`.
```json
{
    "PROPERTY_3": "${ENVIRONMENT_VARIABLE_3}"
}
```
:::

There are four properties at root level:

* url - service url containing protocol, address and port (e.g. `http://service.example.com:3000`).
* setUp - optional list of [set up scripts](../develop/setup-and-teardown.md) that gets executed on startup.
* tearDown - optional list of [tear down scripts](../develop/setup-and-teardown.md) that gets executed on shutdown.
* healthChecks - optional list of [health check modules](../deploy/health-checks.md) for checking the service health.
* middlewares - optional list of [middleware modules](../develop/middleware.md) to load.
* SERVICE_TYPE - configuration of the specific service (differs per type).

An instance can only run one type of service. Each service has its own configuration properties. All types and their properties are explained next.

## Worker

A worker loads application segments and runs its functions on request.

### Segmentation

A worker can load one or multiple segments, making it very easy to combine application pieces that have to be scaled yet. This strategy can save you a lot on hosting costs!

::: warning KEEP IN MIND
Like any other service, a worker runs on the server. Keep this in mind when creating and selecting the segments.
:::

### Gateway registration

When configured, a worker can register itself to a [gateway service](#gateway) to become available in the cluster.

### Configuration properties

The following configuration properties are available:

* gateway - url of the gateway (optional, in case a gateway is used).
* segments - list of segment names to load (required).
* trustKey - key for creating trusted client (optional).

A full configuration example looks like this:

```json
{
    "url": "http://worker.example.com:3000",
    "worker":
    {
        "gateway": "http://gateway.example.com:3000",
        "segments": ["segment1", "segment2"],
        "trustKey": "${MY_TRUST_KEY}"
    }
}
```

### When to use

This is a core service that is always required, except when running Jitar as a [standalone service](#standalone).

## Gateway

The gateway provides a single point of access for running remote application functions. It acts as a mediator between a client and multiple worker services.

### Routing

When a function request comes in, the gateway will look for a worker containing the function and forwards the request.

### Load balancing

If a function is available on multiple workers, the gateway will automatically balance the requests round robin over the workers.

### Worker monitoring

The availability of workers is actively monitored. If a worker cannot be reached or replies to have [an unhealthy state](../monitor/health.md), it will be removed from the gateway.

### Configuration properties

The following configuration properties are available:

* monitor - worker monitoring interval in milliseconds (optional, default `5000`).
* trustKey - key for creating trusted clients (optional).

A full configuration example looks like this:

```json
{
    "url": "http://gateway.example.com:3000",
    "gateway":
    {
        "monitor": 5000,
        "trustKey": "${MY_TRUST_KEY}"
    }
}
```

### When to use

This service is used for creating a cluster and is only useful when working with multiple workers. It also works with a single worker, but adds a lot of overhead.

## Repository

The repository holds and serves application files like a web server.

### Access protection

To protect the access to the application files, assets need to be whitelisted. This can be done per file, or by using glob patterns. For example the pattern `assets/**/*` whitelists all files and subfolder files in the assets folder.

### Configuration properties

The following configuration properties are available:

* index - file to serve when accessed by a web browser (optional, default `index.html`).
* serveIndexOnNotFound - when true, the index file will be served if the requested file is not found (default `false`).
* assets - list of whitelisted assets (optional, default `undefined`).

A full configuration example looks like this.

```json
{
    "url": "http://repository.example.com:3000",
    "repository":
    {
        "index": "index.html",
        "serveIndexOnNotFound": false,
        "assets": ["*.html", "*.js", "*.css", "assets/**/*"]
    }
}
```

### When to use

This service is useful for full-stack applications.
The [standalone service](#standalone) service includes this service.

## Proxy

The proxy acts as an intermediary between clients and a Jitar cluster. It's a single point of access for both the [repository](#repository) and [gateway](#gateway) / [worker](#worker) services.

### Request forwarding

The single purpose of the proxy is to forward requests to the right service. RPC requests are forwarded to the [gateway](#gateway) or [worker](#worker) service (depending on the configuration). Other requests are forwarded to the repository.

### Configuration properties

The following configuration properties are available:

* gateway - url of the gateway (optional if worker property set).
* worker - url of the worker (optional if gateway property set).
* repository - url of the repository (required).

A full configuration example looks like this:

```json
{
    "url": "http://proxy.example.com:3000",
    "proxy":
    {
        "gateway": "http://gateway.example.com:3000",
        "repository": "http://repository.example.com:3000"
    }
}
```

### When to use

This service is not required, but very helpful for protecting your cluster. Common use cases are:

1. Entry point for web-browsers (prevents CORS)
1. Protect access to other services (in a DMZ)

## Standalone

Combines the repository and worker core services into a single instance.

### Configuration properties

The standalone service has the same configuration properties as the repository service:

* index - file to serve when accessed by a web browser (optional, default `index.html`).
* serveIndexOnNotFound - when true, the index file will be served if the requested file is not found (default `false`).
* assets - list of whitelisted assets (optional, default `undefined`).
* segments - list of segment names to load (required).
* trustKey - key for creating trusted clients (optional).

A full configuration example looks like this:

```json
{
    "url": "http://standalone.example.com:3000",
    "standalone":
    {
        "index": "index.html",
        "serveIndexOnNotFound": false,
        "assets": ["*.html", "*.js", "*.css", "assets/**/*"],
        "segments": ["segment1", "segment2"],
        "trustKey": "${MY_TRUST_KEY}"
    }
}
```

### When to use

This service is useful in both development and production environments. It's ideal for development because it only requires a single instance no matter the deployment requirements. In production it's the most simple deployment option for applications that do benefit from being distributed or replicated yet.
