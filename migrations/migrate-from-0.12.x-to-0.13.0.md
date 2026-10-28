# Migrate from 0.12.x to 0.13.0

The configuration of the `--http-body-limit` has been changed. The value is now part of a service configuration, and has been removed from the command line options.

**Before**:

```bash
jitar start --env-file=.env --service=service.json --http-body-limit=204800
```

**Current**:

Configure the body limit using the new http config in the service configuration.

```json
{
  "url": "http://service.example.com:3000",
  "http": {
    "bodyLimit": 2048000
  },
  "standalone":
  {
    ...
  }
}
```

And start the application without the command line option.

```bash
jitar start --env-file=.env --service=service.json
```
