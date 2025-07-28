
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

## Projects

The following projects focus on one particular concept at a time. The examples are kept simple to explain the concept.

1. [Hello Word](hello-world/README.md) - Demonstrates how to create a procedure and call it using the RPC API.
1. [Segmentation](segmentation/README.md) - Demonstrates how to split an application into multiple segments.
1. [Load balancing](load-balancing/README.md) - Demonstrates how to load balance segments.
1. [Access protection](access-protection/README.md) - Demonstrates how to protect the access to a procedure.
1. [Multi Version](multi-version/README.md) - Demonstrates how to create multiple versions of a procedure.
1. [Data Transportation](data-transportation/README.md) - Demonstrates how to transport data between segmented procedures.
1. [Error handling](error-handling/README.md) - Demonstrates how to the error handling works.
1. [Health checks](health-checks/README.md) - Demonstrates how to use health checks.
1. [Middleware](middleware/README.md) - Demonstrates how to use middleware.
1. [Cors](cors/README.md) - Demonstrates how to enable cors.
1. [Resources](resources/README.md) - Demonstrates how to use resources.
