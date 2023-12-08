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
    "setUp": "SET_UP_SCRIPT",
    "tearDown": "TEAR_DOWN_SCRIPT",
    "healthChecks": ["HEALTH_CHECK_SCRIPT"],
    "SERVICE_TYPE":
    {
        "PROPERTY_1": "…",
        "PROPERTY_2": "…"
    }
}
```

There are four properties at root level:

* url - service url containing protocol, address and port (e.g. `http://service.example.com:3000`).
* setUp - optional [set up script](../develop/setup-and-teardown.md) that gets executed on startup (e.g. `./setUp`).
* tearDown - optional [tear down script](../develop/setup-and-teardown.md) that gets executed on shutdown (e.g. `./tearDown`).
* healthChecks - optional list of [health check scripts](../deploy/health-checks.md) for checking the service health.
* SERVICE_TYPE - configuration of the specific service (differs per type).

An instance can only run one type of service. Each service has its own configuration properties. All types and their properties are explained next.

## Repository

The repository holds and serves application files like a web server, with addition that it's segment aware.

### File serving

The repository keeps track of every client and their segments. When a client requests a module file, the repository determines if it needs to serve the actual module or a remote implementation. It will only provide the actual module in case the module is unsegmented or gets requested from the same segment.

Besides serving modules to clients, it also serves application assets like images, documents, etc.. To protect the access to the application files, assets need to be whitelisted. This can be done per file, or by using glob patterns. For example the pattern `assets/**/*` whitelists all files and subfolder files in the assets folder.

### Caching

All application files are served from a cache folder created by Jitar. This folder contains a copy of the application with additional generated files like segmentation information, remote module implementations and more. Detailed information can be found in the [INTERNALS section](../internals/caching.md).

### Configuration properties

The following configuration properties are available:

* source - location of the application code (optional, default `./src`).
* cache - location of the application cache (optional, default `./.jitar`).
* index - file to serve when accessed by a web browser (optional, default `index.html`).
* assets - list of whitelisted assets (optional, default `undefined`).

A full configuration example looks like this.

```json
{
    "url": "http://repository.example.com:3000",
    "repository":
    {
        "source": "./src",
        "cache": "./.jitar",
        "index": "index.html",
        "assets": ["*.html", "*.js", "*.css", "assets/**/*"]
    }
}
```

### When to use

This is a core service that is always required, except when running Jitar as a [standalone service](#standalone).

## Node

A node loads application segments and runs its functions on request.

### Segmentation

A node can load one or multiple segments, making it very easy to combine application pieces that have to be scaled yet. This strategy can save you a lot on hosting costs!

::: warning KEEP IN MIND
Like any other service, a node runs on the server. Keep this in mind when creating and selecting the segments.
:::

### Gateway registration

When configured, a node can register itself to a [gateway service](#gateway) to become available in the cluster.

### Configuration properties

The following configuration properties are available:

* gateway - url of the gateway (optional, in case no gateway is used).
* repository - url of the repository (required).
* segments - list of segment names to load (optional, loads all segments by default).
* middleware - list of [middleware modules](../develop/middleware.md) to load (optional).

A full configuration example looks like this:

```json
{
    "url": "http://node.example.com:3000",
    "node":
    {
        "gateway": "http://gateway.example.com:3000",
        "repository": "http://repository.example.com:3000",
        "segments": ["segment1", "segment2"],
        "middleware": ["./middleware1", "./middleware2"]
    }
}
```

### When to use

This is a core service that is always required, except when running Jitar as a [standalone service](#standalone).

## Gateway

The gateway provides a single point of access for running remote application functions. It acts as a mediator between a client and multiple node services.

### Routing

When a function request comes in, the gateway will look for a node containing the function and forwards the request.

### Load balancing

If a function is available on multiple nodes, the gateway will automatically balance the requests round robin over the nodes.

### Node monitoring

The availability of nodes is actively monitored. If a node cannot be reached or replies to have [an unhealthy state](../monitor/health.md), it will be removed from the gateway.

### Caching

There aren't any caching options yet, but we are planning on implementing them. Please [let us know](../community/contribute.md) if you need this, it will help us prioritize our work!

### Configuration properties

The following configuration properties are available:

* repository - url of the repository (required).
* monitor - node monitoring interval in milliseconds (optional, default `5000`).
* middleware - list of [middleware modules](../develop/middleware.md) to load (optional).

A full configuration example looks like this:

```json
{
    "url": "http://gateway.example.com:3000",
    "gateway":
    {
        "repository": "http://repository.example.com:3000",
        "monitor": 5000,
        "middleware": ["./middleware1", "./middleware2"]
    }
}
```

### When to use

This service is used for creating a cluster and is only useful when working with multiple nodes. It also works with a single node, but adds a lot of overhead.

## Proxy

The proxy acts as an intermediary between clients and a Jitar cluster. It's a single point of access for both the [repository](#repository) and [gateway](#gateway) / [node](#node) services.

### Request forwarding

The single purpose of the proxy is to forward requests to the right service. RPC requests are forwarded to the [gateway](#gateway) or [node](#node) service (depending on the configuration). Other requests are forwarded to the repository.

### Configuration properties

The following configuration properties are available:

* gateway - url of the gateway (optional if node property set).
* node - url of the node (optional if gateway property set).
* repository - url of the repository (required).
* middleware - list of [middleware modules](../develop/middleware.md) to load (optional).

A full configuration example looks like this:

```json
{
    "url": "http://proxy.example.com:3000",
    "proxy":
    {
        "gateway": "http://gateway.example.com:3000",
        "repository": "http://repository.example.com:3000",
        "middleware": ["./middleware1", "./middleware2"]
    }
}
```

### When to use

This service is not required, but very helpful for protecting your cluster. Common use cases are:

1. Entry point for web-browsers (prevents CORS)
1. Protect access to other services (in a DMZ)

## Standalone

Combines the repository and node core services into a single instance.

### Configuration properties

The standalone service has the same configuration properties as the repository service:

* source - location of the application code (optional, default `./src`).
* cache - location of the application cache (optional, default `./.jitar`).
* index - file to serve when accessed by a web browser (optional, default `index.html`).
* assets - list of whitelisted assets (optional, default `undefined`).
* middleware - list of [middleware modules](../develop/middleware.md) to load (optional).

A full configuration example looks like this:

```json
{
    "url": "http://standalone.example.com:3000",
    "standalone":
    {
        "source": "./src",
        "cache": "./.jitar",
        "index": "index.html",
        "assets": ["*.html", "*.js", "*.css", "assets/**/*"],
        "middleware": ["./middleware1", "./middleware2"]
    }
}
```

### When to use

This service is useful in both development and production environments. It's ideal for development because it only requires a single instance no matter the deployment requirements. In production it's the most simple deployment option for applications that do benefit from being distributed or replicated yet.
