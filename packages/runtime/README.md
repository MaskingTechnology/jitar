
# Jitar Runtime

This package provides the client and server for the [Jitar](https://jitar.dev) runtime.

For more information about Jitar:

* [Visit our website](https://jitar.dev)
* [Read the documentation](https://docs.jitar.dev).

## IMPLEMENTATIONS

The runtime implements a client-server architecture.

* **Client** - wraps a local worker service with a remote gateway, supports middleware.
* **Server** - wraps a local proxy service with a configurable runner and provider service, supports middleware and resources.

Both types are constructed by a builder.
