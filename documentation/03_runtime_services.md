---
layout: default
title: Runtime services
---

# Runtime services

The Jitar runtime consists of several services that are introduced in the [How it works](01_introduction#how-it-works) section on the introduction page. In this section we will take a detailed look at the individual services and how to use and configure them.

---

## Repository

The repository service stores and provides application content:

* Assets (static files)
* Components (procedures and objects)
* Segments (splitting information)

Its configuration has the following options:

* **url** - The url of the repository. This is the url that nodes will use to access the repository (optional, default ``http://localhost:3000``).
* **repository** - All repository specific options:
  * **source** - The directory where the application code is stored (optional, default ``./src``).
  * **cache** - The directory where the repository will store its application cache (optional, default ``./cache``).
  * **index** - The file that will be served when accessed by a web browser (optional, default ``index.html``).

The url must have the following format: ``{protocol}://{address}:{port}``

All components are provided from the cache directory. The cache contains the generated code for all components in order to make them distributable, like the remote procedure implementations. The cache is automatically generated / updated at the start of the repository.

An example of a repository configuration:

```json
{
    "url": "http://repo.example.com:3000",
    "repository":
    {
        "source": "./src",
        "cache": "./cache",
        "index": "index.html"
    }
}
```

---

## Gateway

The gateway service provides a single point of access for running application procedures. Its configuration has the following options:

* **url** - The url of the gateway. This is the url that clients and nodes will use to access the application (optional, default ``http://localhost:3000``).
* **gateway** - All gateway specific options:
  * **monitor** - The interval in milliseconds that the gateway will use to monitor its nodes for availability (optiona, default 5000).

The url must have the following format: ``{protocol}://{address}:{port}``

The gateway starts without any nodes because nodes will register themselves at the gateway. The gateway will then forward requests to the nodes that contain the requested procedure.

An example of a gateway configuration:

```json
{
    "url": "http://gateway.example.com:3000",
    "gateway":
    {
        "monitor": 5000
    }
}
```

---

## Node

The node service loads application segments and runs its procedures on request. Its configuration has the following options:

* **url** - The url of the node. This is the url that the gateway or the clients will use to access the node (optional, default ``http://localhost:3000``).
* **node** - All node specific options:
  * **gateway** - The url of the gateway (optional, in case no gateway is used).
  * **repository** - The url of the repository to load the segments from.
  * **segments** - The segment names to load and run their procedures.

All urls must have the following format: ``{protocol}://{address}:{port}``

The segment names are derived from the segment configuration files. The name segment1 points for example to the segement1.segment.json file.

An example of a node configuration:

```json
{
    "url": "http://node.example.com:3000",
    "node":
    {
        "gateway": "http://gateway.example.com:3000",
        "repository": "http://repo.example.com:3000",
        "segments": ["segment1", "segment2"]
    }
}
```

---

## Proxy

The proxy service acts as a single point of access to the cluster. Its responsible for forwarding:

1. RPC requests to the gateway.
2. Assets request to the repository.

It can be added to the cluster to:

1. Protect the access to the other services (in a DMZ).
2. Act as an web server for full-stack applications.

Its configuration has the following options:

* **url** - The url of the proxy. This is the url that clients will use to access the application (optional, default ``http://localhost:3000``).
* **proxy** - All proxy specific options:
  * **gateway** - The url of the gateway for forwarding all RPC requests (only when the node option is not set).
  * **node** - The url of the node for forwarding all RPC requests (only when the gateway option is not set).
  * **repository** - The url of the repository for forwarding all asset requests.

All urls must have the following format: ``{protocol}://{address}:{port}``

An example of a proxy configuration:

```json
{
    "url": "http://app.example.com:3000",
    "proxy":
    {
        "gateway": "http://gateway.example.com:3000",
        "repository": "http://repo.example.com:3000"
    }
}
```

---

## Standalone

The standalone service combines all services into single Jitar instance. It can be used for running simple client-server applications that do not require the setup of a cluster. Its configuration has the following options:

* **url** - The url of the standalone. This is the url that clients will use to access the application (optional, default ``http://localhost:3000``).
* **standalone** - All standalone specific options:
  * **source** - The directory where the application code is stored (optional, default ``./src``).
  * **cache** - The directory where the repository will store its application cache (optional, default ``./cache``).
  * **index** - The file that will be served when accessed by a web browser (optional, default ``index.html``).
  * **segments** - The segment names to load and run their procedures (optional, default loads all segments).

All urls must have the following format: ``{protocol}://{address}:{port}``

The standalone service scans for all segment names in the source directory and loads them automatically, so they do not have to be specified in the configuration.

An example of a standalone configuration:

```json
{
    "url": "http://app.example.com:3000",
    "standalone":
    {
        "source": "./src",
        "cache": "./cache",
        "index": "index.html",
        "segments": ["segment1", "segment2"]
    }
}
```

---

## Server options

Additionally thare are some general options that can be used to configure the server.

* **loglevel** - The log level of the server. This can be one of the following: ``debug``, ``info``, ``warn``, ``error`` (optional, default ``info``).
* **config** - The path to the service configuration file (optional, default ``./config.json``).

These options can be specified in the command line:

```bash
node --experimental-network-imports --experimental-fetch dist/start.js --loglevel=debug --config=jitar.json
```

---

{:.previous-chapter}
[Getting started](02_getting_started)

{:.next-chapter}
[Basic features](04_basic_features)
