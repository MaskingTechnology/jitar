# Migrate from 0.9.x to 0.10.0

This release contains one breaking change. In previous versions of Jitar, the worker monitoring interval was configured with the `monitor` property. In this release, the property has been renamed to `monitorInterval`.

**Before**:

```json
{
    "url": "http://gateway.example.com:3000",
    "gateway":
    {
        "monitor": 5000
    }
}
```

**Current**:

```json
{
    "url": "http://gateway.example.com:3000",
    "gateway":
    {
        "monitorInterval": 5000
    }
}
```
