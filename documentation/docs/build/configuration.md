---
layout: doc

prev:
    text: Build arguments
    link: /build/arguments

next:
    text: Segmentation
    link: /deploy/segmentation

---

# Configuration

The jitar build process is configured using a `jitar.json` file. This file is optional and defines the location of the `source`, `target`, `segments`, and `resources` folders. These values are used to split the application in separate deployable bundles and create the necessary configuration files for the jitar runtime.

## Jitar configuration file

The `jitar.json` file is a JSON file that contains the following properties:

```json
{
    "source": "./src",
    "target": "./dist",
    "segments": "./segments",
    "resources": "./resources"
}
```

::: tip INFO
The configuration also supports environment variables. They can be used by wrapping the variable name in `${}`. For example, `${source}`.
```json
{
    "source": "${source}"
}
```
:::

There are four properties in the configuration file:
* `source` - the location of the source files (default `./src`).
* `target` - the location of the target files (default `./dist`).
* `segments` - the location of the segment configuration files (default `./segments`).
* `resources` - the location of the resource files (default `./resources`).

::: tip
For a TypeScript project, the `source` folder should be the target folder after transpilation, so it should be `./dist` instead of `./src`. The `target` folder can be the same as the `source` folder in this case, but it can also be a different folder.
:::

::: warning IMPORTANT
The build process deletes the files in the `target` folder during the build process. Make sure that it doesn't point to the `src` folder.
:::
