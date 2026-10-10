# Migrate from 0.11.x to 0.12.0

The service configuration has been updated and contains some breaking changes.

The service configuration for the [repository](https://docs.jitar.dev/fundamentals/runtime-services.html#repository) and the [standalone](https://docs.jitar.dev/fundamentals/runtime-services.html#standalone) service have two new values that replace existing ones. The `indexFilename` has been renamed to `directoryIndex` to more clearly communicate the purpose of this variable. The `serveIndexOnNotFound` has been removed and replaced by `fallback` which is the name of the fallback page when a file is not found.

**Before**:

```json
{
  "url": "http://repository.example.com:3000",
  "repository":
  {
    "indexFilename": "index.html",
    "serveIndexOnNotFound": true,
    "assetRoot": "./app",
    "assets": []
  }
}
```

**Current**:

```json
{
  "url": "http://repository.example.com:3000",
  "repository":
  {
    "directoryIndex": "index.html",
    "fallback": "index.html",
    "assetRoot": "./app",
    "assets": []
  }
}
```
