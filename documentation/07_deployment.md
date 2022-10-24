---
layout: default
title: Deployment
---

# Deployment

This section provides information for releasing applications and running them in production.

---

## Creating bundles

To keep an overview over the components of an application, we recommend to place components into a separate file as much as possible. When an application is ready for deployment, all components can be bundled into a single file per segment to speed up the startup time of a node.

{:.alert-info}
We do not provide a tool yet to create segment bundles automatically. This is planned to be added before releasing version 1.0 of Jitar.

Creating segment bundles manually can be simply done by creating a module that imports all segment components and exports them again.

{:.filename}
src/default.ts

```ts
export { default as procedureA } from './procedureA';
export { default as procedureB } from './procedureB';
export { default as procedureC } from './procedureC';
```

The segment configurations need to be updated to import the procedures from the module.

{:.filename}
default.segment.json

```json
{
    "./default.js": {
        "procedureA": {
            "access": "public"
        },
        "procedureB": {
            "access": "public"
        },
        "procedureC": {
            "access": "public"
        }
    }
}
```

A bundler tool like [Webpack](https://webpack.js.org/){:target="_blank"} or [Rollup](https://rollupjs.org){:target="_blank"} can be used for generating an optimized module. By placing the created bundle(s) into a `build` folder, it's easy to use them for Jitar by setting this folder as source.

```json
{
    "mode": "repository | standalone",
    "source": "./build",
    "cache": "./build-cache",
    "...": "..."
}
```

---

## Creating a cluster

Creating a cluster means spreading multiple services over multiple servers to run a single application. There is no fixed recipie for creating a cluster, but there are some options to consider.

Important to know is that any cluster:

1. Requires at least one [repository](03_runtime_services#repository).
1. Requires at least one [node](03_runtime_services#node) and can scale up to a large amount of nodes.
1. Only requires a [gateway](03_runtime_services#gateway) when working with multiple nodes that need orchestration or load balancing.
1. Does not require a [proxy](03_runtime_services#proxy).

The following are some examples of clusters:

* **Minimal** - Repository and a node (minimal setup).
* **Microservices** - Repository, multiple nodes and a gateway.
* **Full-stack** - Repository, multiple nodes, a gateway and a proxy.

---

## Using Docker

For easy deployment of Jitar services [Docker](https://www.docker.com/){:target="_blank"} can be used. We recommend using an official [Node.js Docker image](https://hub.docker.com/_/node){:target="_blank"}. In case you run into any issues, please create an issue on our [GitHub issues page](https://github.com/MaskingTechnology/jitar/issues){:target="_blank"}.

{:.alert-info}
In the future we will provide a Docker image for Jitar.

---

{:.previous-chapter}
[Building applications](06_building_applications)
