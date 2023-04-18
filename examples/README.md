
# Jitar | Examples

To get started with Jitar we've created examples to explain and demonstrate the features of Jitar.
We advice to study these examples in the order they're specified below.

**Note:** All examples are in TypeScript. If you're not familiar with TypeScript,
the examples should still be understandable.

## Requirements

In order to run the examples you need to have the following installed:

* [Node.js](https://nodejs.org/en/) version 18.7.0 or higher
* [TypeScript](https://www.typescriptlang.org/) version 4.4.2 or higher

Most examples do not have an UI to keep them simple and focussed. For running these examples the PRC API will be used.
A ``requests.http`` file is provided containing example requests to call the procedures. We use
[Visual Studio Code](https://code.visualstudio.com/) with the
[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to run these requests.
But you can use any http client like [Postman](https://www.postman.com/).

## Basic examples

The following examples are the most basic examples to get started with Jitar. They demonstrate the following basic features.

1. [Hello Word](1-basic/1-hello-world/README.md) - Demonstrates how to create a procedure and call it using the RPC API.
1. [Segmentation](1-basic/2-segmentation/README.md) - Demonstrates how to split an application into multiple segments.
1. [Load balancing](1-basic/3-load-balancing/README.md) - Demonstrates how to load balance segments.
1. [Access protection](1-basic/4-access-protection/README.md) - Demonstrates how to protect the access to a procedure.
1. [Multi Version](1-basic/5-multi-version/README.md) - Demonstrates how to create multiple versions of a procedure.
1. [Data Transportation](1-basic/6-data-transportation/README.md) - Demonstrates how to transport data between segmented procedures.
1. [Error handling](1-basic/7-error-handling/README.md) - Demonstrates how to the error handling works.
1. [JavaScript](1-basic/8-javascript/README.md) - Demonstrates how to work with JavaScript instead of TypeScript.

## Advanced examples

The following examples are more advanced examples to get started with Jitar. They demonstrate the following advanced features.

1. [Start hooks](2-advanced/1-start-hooks/README.md) - Demonstrates how to start a Jitar server and client.
1. [Run procedure](2-advanced/2-run-procedure/README.md) - Demonstrates how to run a procedure dynamically.
1. [Health checks](2-advanced/3-health-checks/README.md) - Demonstrates how to use health checks.
1. [Middleware](2-advanced/4-middleware/README.md) - Demonstrates how to use middleware.

## Application examples

The following examples combine the basic and advanced features. They demonstrate how to build real-world
applications using Jitar.

1. [Contact list](3-apps/1-contact-list/README.md) - Example of a full stack application build with React, MongoDB and Jitar.
