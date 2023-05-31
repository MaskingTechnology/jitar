---
layout: doc

prev:
    text: Caching
    link: /internals/caching

next:
    text: Reflection
    link: /internals/reflection

---

# Data serialization

Jitar comes with a powerful (de)serializer that is used for sharing data between nodes. In this section you'll find more information on this topic..

Note: The serializer is available as a separate NPM package that you can use in your own project. You can find more information on this in the [readme of the package](https://github.com/MaskingTechnology/jitar/blob/main/packages/serialization/README.md){target="_blank"}.

## Build-in serializers

We try to support all JavaScript built-in types. Currently we support:

* Primitives (bool, number, string, etc.)
* Objects (plain and class instances)
* Collections (Array, Map and Set)
* Data buffers (Typed Arrays)
* Others (Date and URL)

And we have planned to add support for:

* Big integers
* Regular expressions

## Adding your own

The serialization package is open for implementing your own serializers in case  your application has special (de)serialization needs. Jitar currently does not support adding custom serializers, but will be supported in future versions.
