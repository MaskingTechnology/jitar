
# Jitar Services

This package provides the services of the [Jitar](https://jitar.dev) runtime.

For more information about Jitar:

* [Visit our website](https://jitar.dev)
* [Read the documentation](https://docs.jitar.dev).

## SERVICES

Two types of services, each with their own responsibilities.

### Runner services

Run procedures by their FQN.

* **Worker** - Executes containing procedures locally, and delegates others to a remote gateway.
* **Gateway** - Forwards run requests to workers that contain the requested procedure.

### Provider services

Provide files by their filename.

* **Repository** - Holds and provides files.

### Hybrid services

Run requests and provide files.

* **Proxy** - Forwards run requests to a gateway (or worker) and provide requests to a repository.

## SERIALIZATION

Managed by the **local worker** via header `X-Jitar-Data-Encoding` with value `serialized`.

If the incoming request contains this header, the data the worker deserializes the data before execution and will serialize the response data.

Outgoing (remote) requests always set this header, and the worker serializes the request data before sending it.
