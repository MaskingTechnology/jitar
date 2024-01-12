---
layout: doc

prev:
    text: Reflection
    link: /internals/reflection

next:
    text: App examples
    link: /examples/apps

---

# Concept examples

To experience the concepts of Jitar we've created examples for them. Each example can be viewed and downloaded from the repository.

## Hello world

In this example you’ll find the simplest Jitar application possible. It doesn’t have to be complicated, does it?

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/hello-world){target="_blank"}

## Segmentation
This example demonstrates how to distribute an application in production. It also shows the simple setup that is required for development purposes.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/segmentation){target="_blank"}

## Load balancing

Jitar comes with load balancing capabilities out-of-the-box. This example demonstrates how to load balance application segments by running them on multiple nodes.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/load-balancing){target="_blank"}

## Access-protection

Not every function should be publicly available. You’ll see how to protect the access to a function.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/access-protection){target="_blank"}

## Multi version

Having multiple versions of the same function is easy when migrating parts of the application to the next version. The example shows how to create multiple versions for a function and how to register them as versioned functions in a segment.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/multi-version){target="_blank"}

## Data transportation

Sharing data between services is crucial when communicating. In this example we demonstrate how data is transported between segments.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/data-transportation){target="_blank"}

## Error handling

Jitar provides a large number of errors out-of-the-box. But when you want to use a custom error, this example will show how those are supported.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/error-handling){target="_blank"}

## Node client

This example demonstrates how to set up a node client. It’s for you when you already have a node client and seek an alternative to our RPC API. 

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/node-client){target="_blank"}

## Health checks

For the health of a cluster it’s important that nodes can communicate their health status. In this example you’ll learn how to create heath checks and request the health of a service.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/health-checks){target="_blank"}

## Middleware

Middleware is useful for manipulating requests and responses. In this example we demonstrate how to create and add custom middleware.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/middleware){target="_blank"}

## Cors

When the frontend of the application is not hosted by Jitar you want to enable cors on the web server. Jitar provides a cors middleware and in this example we demonstrate how to enable cors.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/cors){target="_blank"}

## Construction

When starting and stopping an Jitar service, it might be useful to do additional tasks. In this example the use of start up and tear down scripts is demonstrated.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/construction){target="_blank"}

## Overrides

This example demonstrates how to override module imports.

[View in repository](https://github.com/MaskingTechnology/jitar/tree/main/examples/concepts/overrides){target="_blank"}
