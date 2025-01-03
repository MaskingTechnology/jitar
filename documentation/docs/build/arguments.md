---
layout: doc

prev:
    text: Debugging
    link: /develop/debugging

next:
    text: Build configuration
    link: /build/configuration

---

# Settings

The build process accepts a few command line arguments to configure its build behavior. A fully configured command line looks like this:

```bash
jitar build --env-file=.env --log-level=info --config=jitar.json
```

## Environment file

The `--env-file` argument can be used to specify a file that contains environment variables. This is an optional argument without a default value.

## Log level

To control the level of logging, the optional `--log-level` argument can be used. The default for this value is `info`. A more elaborate description of the log levels can be found in the [logging](../monitor/logging) section.

## Configuration file

To control the input and output of the build process. The `--config` argument can be used to specify a configuration file. This is an optional argument with the default value `jitar.json`.
