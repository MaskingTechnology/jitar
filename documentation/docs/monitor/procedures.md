---
layout: doc

prev:
    text: Health
    link: /monitor/health

next:
    text: Nodes
    link: /monitor/nodes

---

# Procedures

Both the [gateway service](../fundamentals/runtime-services#gateway) and the [node service](../fundamentals/runtime-services#node) keep a list of functions ([FQNs](../fundamentals/building-blocks#fully-qualified-name-fqn)) that can be run as remote procedures using the [RPC API](../integrate/rpc-api). This list can be requested with the procedures API.

```http
GET http://proxy.example.com:3000/procedures HTTP/1.1
```

The API returns a list of procedure names (FQNs) that are registered with this service.

``` json
[
    “procedure1”,
    “procedure2”
]
```

This API is also available for the [proxy service](../fundamentals/runtime-services#proxy). It will forward the request to its configured gateway / node.
