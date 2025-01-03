---
layout: doc

prev:
    text: Segmentation
    link: /deploy/segmentation

next:
    text: Environments
    link: /deploy/environments

---

# Resources

Resources are objects that maintain state. For example, a database connection or a connection to a file store. These resources are usually machine-wide and could be shared between different segments when they are deployed on the same machine.

In Jitar's [segmentation model](/deploy/segmentation), each segment is isolated from the others. This means that each segment has its own copy of any shared code. This feature is useful for creating independent deployable packages. However, it also means that resources cannot be shared between segments by default. By defining which modules are resources, Jitar won't duplicate the code and will share the resource between segments.

### Resource files

Jitar reads resource definitions files from the `resources` directory. The files are in JSON format. Each entry defines the entry point of the `module` that should be used as a resource.

The file has the following structure:

```json
// app.json
[
    "./integrations/authentication/entry-file",
    "./integrations/database/index",
    "./integrations/filestore
]
```

::: info
The `/index` part is optional. If the module is a directory, Jitar will automatically look for the index file.
:::

::: tip
It's possible to define multiple resource files within a project. This is useful in a monorepo setup where different modules might be managed by different teams.
:::