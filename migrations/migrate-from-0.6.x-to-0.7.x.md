# Migrate from 0.6.x to 0.7.0

The 0.7 version of Jitar introduces breaking changes. All changes are described here, with instructions how to adopt them.

## Removed support for Node 18 and 19

The configuration now works with environment variables. This makes it easier and safer to configure the runtime services. But for reading the values in Node, the out-of-the-box .env capability of Node is used. Node 20 is the first version of Node that supports this. We've removed the support for the older versions of Node.

## Renamed the `node` service to `worker`

The name `node` was confusing, because each and every service in the cluster is a node. We've renamed the service to `worker` to make it more clear what it does. A couple of things have changed.

### Service configuration

The service configuration for a worker looked like this:
```json
{
    "url": "https://node.example.com",
    "node":
    {
        "gateway": "https://gateway.example.com",
        "repository": "https://repository.example.com",
        "segments": [ "hello" ]
    }
}
```
And now looks like the following:

```json
{
    "url": "https://worker.example.com",
    "worker":
    {
        "gateway": "https://gateway.example.com",
        "repository": "https://repository.example.com",
        "segments": [ "hello" ]
    }
}
```

The configuration for the `proxy` service has changed in the same way.

Previously, it looked like this:

```json
{
    "url": "https://proxy.example.com",
    "proxy":
    {
        "repository": "https://repository.example.com",
        "node": "https://node.example.com"
    }
}
```

And now it looks like the following:

```json
{
    "url": "https://proxy.example.com",
    "proxy":
    {
        "repository": "https://repository.example.com",
        "worker": "https://worker.example.com"
    }
}
```

### Worker api

The gateway service has some external apis that can be used to get an overview of all registered workers. The url of these apis has changed from `/nodes` to `/workers`.

The previous url was:
```http
https://gateway.example.com/nodes
```

The new url is:
```http
https://gateway.example.com/workers
```
