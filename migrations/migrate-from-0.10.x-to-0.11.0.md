# Migrate from 0.10.x to 0.11.0

Jitar now supports multiple apps in a monorepo setup. The Vite plugin has been updated to support this new structure and introduces a breaking change.

The configuration of the Vite plugin has been changed to reflect this. Three parameters have been removed from the plugin configuration: `sourceDir`, `targetDir` and `jitarDir` as these were tied to a single app structure. The newly added parameters are `projectRoot`, `sourceRoot`, `configurationFile` and `environmentFile`.

The [docs](https://docs.jitar.dev/integrate/vite-plugin.html) contain in-depth information about the updated configuration and an example of how to use it.

**Before**:

```ts
const jitarConfig: JitarConfig = {
  sourceDir: './src',
  targetDir: './dist',
  jitarDir: 'domain',
  jitarUrl: 'http://localhost:3000',
  segments: ['frontend'],
  middleware: ['./requesterMiddleware']
};
```

**Current**:

```ts
const jitarConfig: JitarConfig = {
  projectRoot: '../../',
  sourceRoot: '../',
  configurationFile: './jitar.json',
  environmentFile: './dev.env',
  jitarUrl: 'http://localhost:3000',
  segments: ['frontend'],
  middleware: ['./requesterMiddleware']
};
```
