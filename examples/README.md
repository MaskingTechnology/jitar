
# Jitar | Examples

To get started with Jitar we've created examples to explain and demonstrate the concepts of Jitar.
We advice to study these examples in the order they're specified below.

**Note:** All examples are in TypeScript. If you're not familiar with TypeScript,
the examples should still be understandable.

## Requirements

In order to run the examples you need to have the following installed:

* [Node.js](https://nodejs.org/en/) version 20.0.0 or higher
* [TypeScript](https://www.typescriptlang.org/) version 4.4.2 or higher

Most examples do not have an UI to keep them simple and focussed. For running these examples the PRC API will be used.
A ``requests.http`` file is provided containing example requests to call the procedures. We use
[Visual Studio Code](https://code.visualstudio.com/) with the
[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to run these requests.
But you can use any http client like [Postman](https://www.postman.com/).

## Concepts

The following examples focus on one particular concept at a time. The examples are kept simple to explain the concept.

1. [Hello Word](concepts/hello-world/README.md) - Demonstrates how to create a procedure and call it using the RPC API.
1. [Segmentation](concepts/segmentation/README.md) - Demonstrates how to split an application into multiple segments.
1. [Load balancing](concepts/load-balancing/README.md) - Demonstrates how to load balance segments.
1. [Access protection](concepts/access-protection/README.md) - Demonstrates how to protect the access to a procedure.
1. [Multi Version](concepts/multi-version/README.md) - Demonstrates how to create multiple versions of a procedure.
1. [Data Transportation](concepts/data-transportation/README.md) - Demonstrates how to transport data between segmented procedures.
1. [Error handling](concepts/error-handling/README.md) - Demonstrates how to the error handling works.
1. [Node client](concepts/node-client/README.md) - Demonstrates how to start a Jitar server and client.
1. [Health checks](concepts/health-checks/README.md) - Demonstrates how to use health checks.
1. [Middleware](concepts/middleware/README.md) - Demonstrates how to use middleware.
1. [Cors](concepts/cors/README.md) - Demonstrates how to enable cors.
1. [Construction](concepts/construction/README.md) - Demonstrates how to use a set up and tear down scripts.
1. [Overrides](concepts/overrides/README.md) - Demonstrates how to use import overrides.

## Application examples

The following examples demonstrate how to build real-world applications using Jitar.

1. [Contact list](apps/contact-list/README.md) - Example of a full stack application build with React, MongoDB and Jitar.
