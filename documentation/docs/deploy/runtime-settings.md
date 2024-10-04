---
layout: doc

prev:
    text: Health checks
    link: /deploy/health-checks

next:
    text: RPC API
    link: /integrate/rpc-api

---

# Runtime settings

The server accepts a few command line arguments to configure its runtime behavior. A fully configured command line looks like this:

```bash
jitar start --service=services/standalone.json --env-file=.env --log-level=info --http-body-limit=204800
```

## Service file

The `--service` argument must be specified to point to the server configuration file. More information regarding the configuration file can be found in the [runtime services](../fundamentals/runtime-services#basic-configuration) section.

## Environment file

The `--env-file` argument can be used to specify a file that contains environment variables. This is an optional argument without a default value. 

## Log level

To control the level of logging, the optional `--log-level` argument can be used. The default for this value is `info`. A more elaborate description of the log levels can be found in the [logging](../monitor/logging) section.

## Body limit

To control the maximum json body size of incoming requests, the `--http-body-limit` argument can be used. This is an optional argument and the body size limit defaults to 200KB if no value is provided. The value can only be set in bytes using a numeric value, e.g. `--http-body-limit=1048576` for 1MB.
