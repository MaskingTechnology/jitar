---
layout: doc

prev:
    text: Build settings
    link: /build/settings

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

All properties are optional and have default values. The defaults are based on a JavaScript project, so the `source` and `target` folders are `./src` and `./dist` respectively. For the `segments` and `resources` folders  the defaults are `./segments` and `./resources`.

For a TypeScript project, the `source` folder should be the target folder after transpilation, so it should be `./dist` instead of `./src`. The `target` folder can be the same as the `source` folder in this case, but it can also be a different folder.

::: tip
The build process deletes the files in the `target` folder during the build process. Make sure that it doesn't point to the src folder.
:::

## Environment variables
The `jitar.json` file can also contain environment variables. The values of the properties can be environment variables. For example:

```json
{
    "source": "${SOURCE}",
    "target": "${TARGET}",
    "segments": "${SEGMENTS}",
    "resources": "${RESOURCES}"
}
```
