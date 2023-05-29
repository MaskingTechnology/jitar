---
layout: doc

prev:
    text: Logging
    link: /monitor/Logging

next:
    text: Procedures
    link: /monitor/procedures

---

# Health

Jitar provides a health API to check the health of any service. This API is internally used by the gateway to check the health of its nodes, but can also be used for external monitoring. This API triggers all [health checks](../deploy/health-checks) added to the service.

There are two types of health checks available. Both are explained next.

## Getting the overall status

If you're only interested in the overall health of a service, you can use the following endpoint.

```http
GET http://node.example.com:3000/health/status HTTP/1.1
```

This will return a boolean value indicating its health. When `true` the service is healthy, when `false` it's unhealthy.

## Getting detailed information

If you want to get more detailed health information, for example when the overall status returns false, you can use the following endpoint.

```http
GET http://node.example.com:3000/health HTTP/1.1
```

This will return a JSON object with the health details of each health check in the following format.

```json
{
    "database": false,
    "objectstore": true
}
```

When adding a health check a name must be specified. This name is used as an entry in the result object.
