---
layout: doc

prev:
    text: Procedures
    link: /monitor/procedures

next:
    text: Creating a cluster
    link: /guides/creating-a-cluster

---

# Nodes

The [gateway service](../fundamentals/runtime-services#gateway) keeps a list of its active nodes. These can be requested with the nodes API.

```http
GET http://gateway.example.com:3000/nodes HTTP/1.1
```

This returns a list of registered nodes. Per node the url and procedure names (FQNs) are returned.

```json
[
    {
        "url": "http://node.example.com:3002",
        "procedureNames": [
            "procedure1",
            “procedure2”
        ]
    }
]
```
