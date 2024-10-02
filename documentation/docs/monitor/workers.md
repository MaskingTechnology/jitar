---
layout: doc

prev:
    text: Procedures
    link: /monitor/procedures

next:
    text: Creating a cluster
    link: /guides/creating-a-cluster

---

# Workers

The [gateway service](../fundamentals/runtime-services#gateway) keeps a list of its active workers. These can be requested with the workers API.

```http
GET http://gateway.example.com:3000/workers HTTP/1.1
```

This returns a list of registered workers. Per worker the url and procedure names (FQNs) are returned.

```json
[
    {
        "url": "http://worker.example.com:3002",
        "procedureNames": [
            "procedure1",
            "procedure2"
        ]
    }
]
```
