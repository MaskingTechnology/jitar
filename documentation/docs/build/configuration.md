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

The jitar build process and runtime environment is configured using a JSON file. This file is optional and can be added to a project at any time.

## Jitar configuration file

By default, Jitar looks for a `jitar.json` file in the project's root directory, but you can use a different filename and specify it when running the CLI.

A basic configuration contains the following properties:

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

There are four main properties in the configuration file:
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

## Specific build options

Additionally, the configuration supports specific build options.

```json
{
    "source": "./src",
    "build": {
        "ignore": ["app/**/*"]
    }
}
```

* `build.ignore` - list of glob patterns, relative to the source folder, specifying files that should be ignored during the build (default `[]`).