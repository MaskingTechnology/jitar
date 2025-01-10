# Migrate from 0.8.x to 0.9.0

This release contains one breaking change. In previous versions of Jitar, segment files were scanned from the root of the project and had to have the extension `.segment.json`. This is no longer the case. The location of the segment files is now configurable.

The default location is `./segments` and can be overwritten in the `jitar.json` configuration file. The configuration key is `segments`.

```json
{
  "segments": "./my-segments"
}
```
