---
layout: doc

prev:
    text: Writing functions
    link: /develop/writing-functions

next:
    text: Data sharing
    link: /develop/data-sharing

---

# Creating segments
Segments group module files that need to be deployed together. Their definition is placed into a JSON file with the '.segment.json' extension with the following content:

1. One or more module files
1. Exposed functions per module file
1. Access level per function (public / private, default private)
1. Version number per function (optional, default 0.0.0)
1. Alternative name (optional, default the name of the function)

Let's look at a simple example file named `default.segment.json`:

```json
{
    "./shared/sayHello":
    {
        "sayHello":
        {
            "access": "public",
            "version": "0.0.0",
            "as": "sayHello"
        }
    }
}
```

This configuration exposes the `sayHello` function from the `./shared/sayHello` module file. The function has public access, meaning that it's accessible from other segments. Both the `version` and `as` properties have the default value, so these can optionally be removed.

More in depth information on segments and the configuration can be found in the [fundamentals section](../fundamentals/overview.md#segments).