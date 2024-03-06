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
node --experimental-network-imports dist/jitar.js --config=services/standalone.json --loglevel=info --bodylimit=204800
```

## Network imports

Jitar is heavily dependent on network imports for importing functions and other components. Node needs the `--experimental-network-imports` flag in order to import enable this feature.

## Log level

To control the level of logging, the optional `--loglevel` argument can be used. The default for this value is `info`. A more elaborate description of the log levels can be found in the [logging](../monitor/logging) section.

## Configuration

The `--config` argument must be specified to point to the server configuration file. More information regarding the configuration file can be found in the [runtime services](../fundamentals/runtime-services#basic-configuration) section.

## Body limit

To control the maximum json body size of incoming requests, the `--bodylimit` argument can be used. This is an optional argument and the body size limit defaults to 200KB if no value is provided. The value can only be set in bytes using a numeric value, e.g. `--bodylimit=1048576` for 1MB.
