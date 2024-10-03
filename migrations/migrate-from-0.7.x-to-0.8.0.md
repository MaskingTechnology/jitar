# Migrate from 0.7.x to 0.8.0

The 0.8 version of Jitar is a complete rewrite from dynamic to static imports and introduces breaking changes. All changes are described here, with instructions how to adopt them.

## CLI

A CLI has been introduced to make it easier to build and start Jitar projects. 

## Jitar config file

A new configuration file has been introduced to define the output folder for the jitar build. The `jitar.json` file should be placed in the root of the project. The file should look like this:

```json
{
    "source": "./src",
    "target": "./dist"
}
```

The above configuration shows the default configuration and works for JavaScript projects. For TypeScript projects, the source should be the transpiled JavaScript output folder.

The `target` folder is the location of the build output. We like to work with the `.jitar` folder.

## Services configuration

The services configuration has been updated in a couple of ways. The `middleware` has been removed from the service configuration and moved to the root of the configuration file.

`segments` is now a mandatory field. Previously, omitting it resulted in loading all segments, which was confusing and unclear. Each service must now explicitly define the segments it wants to load.

The old configuration:

```json
{
    "url": "https://standalone.example.com",
    "standalone":
    {
        "middlewares": [
            "./myMiddleware"
        ]
    }
}
```

And now looks like the following:


```json
{
    "url": "http://standalone.example.com",
    "middlewares": [
        "./myMiddleware"
    ],
    "standalone":
    {
        "segments": ["hello"]
    }
}
```

## Segment configuration

In the previous version of Jitar, JavaScript classes and Errors were dynamically loaded. Since dynamic imports are no longer supported, this practice is no longer possible. When classes and Errors need to be shared across multiple segments, they must be added to the segment configuration.

Each segment that needs to receive a class or an Error must define them in its segment configuration.

```json
{
    "./account/Account": {
        "default": { }
    }
}
```

## Jitar starter file

The jitar starter file, named `jitar.ts` is not required anymore. This file must be removed from the project.

## Package.json

A couple of changes have to be made to any `package.json` file.

### Experimental network imports

The previous version of Jitar needed the `--experimental-network-imports` flag to be set. This was due to the dynamic imports. Node.js 22.7 removed the support for this flag and is no longer supported.

### Scripts

The build and start script should be updated to use the CLI.

```json
{
    "scripts": {
        "build": "jitar build",
        "standalone": "jitar start --env-file=.env --service=services/standalone.json"
    }
}
```

## Vite plugin

The output folder of the Vite build is added to the configuration of the Vite plugin. This output folder should be the same as the `source` property in the `jitar.json` file.

```javascript
export default defineConfig({
    plugins: [
        jitar({
            sourceDir: 'src',
            targetDir: 'dist',
            jitarDir: '.jitar',
            jitarUrl: 'http://localhost:3000',
            segments: ['frontend'],
            middleware: ['./myMiddleware']
        })
    ]
});
```
