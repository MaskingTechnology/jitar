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

Unsegmented files are not shared between different segments. This is a powerful feature that allows you to create isolated segments that can be deployed independently. To enable different segments to share state, i.e. a database connection, Jitar uses a resource system.

## Resource files

Jitar will search for resource files in the project directory. The resource files are named `*.resource.json`. Each file defines the `module` that should be used as a resource. It's not possible to define a specific function or class from a module as a resource. 

The file has the following structure.

```json
// app.resource.json
[
    "./integrations/authentication/module",
    "./integrations/database/module",
    "./integrations/filestore/module",
    "./integrations/notification/module"
]
```

It's possible to define multiple resource files within a project. This is useful in a monorepo setup where different modules might be managed by different teams.