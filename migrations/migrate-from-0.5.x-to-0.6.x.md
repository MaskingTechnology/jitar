# Migrate from 0.5.x to 0.6.0

The 0.6 version of Jitar introduces breaking changes to ... All changes are described here, with instructions how to adopt them.

## Set up and tear down scripts

Only one start up and tear down script could be registered at a server. To make this a bit more flexible, we've made it possible to register multiple scripts.

### Old situation

In the 'old' setup the scripts are registered like this.

```json
{
    "setUp": "./setUp",
    "tearDown": "./tearDown"
}
```

### New situation

Now, the script needs to be wrapped in an array like this:

```json
{
    "setUp": ["./setUp"],
    "tearDown": ["./tearDown"]
}
```

In case multiple scripts are registered, whey will be loaded in the given order.
