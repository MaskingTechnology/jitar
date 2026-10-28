---
layout: doc

prev:
    text: Data consistency
    link: /develop/data-consistency

next:
    text: Set up and tear down
    link: /develop/setup-and-teardown

---

# Http settings

The options given here control the behavior of the underlying http server implementation.

The configuration below is only the http part of the [service configuration](../fundamentals/runtime-services.md#basic-configuration).

```json
{
    "http": {
        "bodyLimit": 204800,
        "proxied": true
    }
}
```

The following values can be configured:

* bodyLimit - the maximum size of the request body (optional, default 200KB)
* proxied - does the application run behind a proxy (optional, default true)

::: warning Note
When running Jitar in development, set the `proxied` to `false` to let Jitar generate the `X-Forwarded-Proto`, `X-Forwarded-Host` and `X-Forwarded-For` headers.
:::
