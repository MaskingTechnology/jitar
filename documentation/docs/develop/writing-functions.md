---
layout: doc

prev:
    text: Application structure
    link: /develop/application-structure

next:
    text: Creating segments
    link: /develop/creating-segments

---

# Writing functions
Functions are the primary building blocks for Jitar applications. To ensure your application can be broken into segments and keep working after distribution, the following rules apply to segmented functions:

1. Need to be async (require the async keyword);
1. Must be exported (named or as default);
1. Must be stateless / pure (can't depend on global values);

Let's see how a simple function looks like:

```ts
export async function sayHello(name: string): Promise<string>
{
    return `Hello, ${name}!`;
}
```

As long as you follow these rules, all will be fine. One thing to keep in mind is that arrow functions are supported, but can only be safely used in a non-distributed context. Meaning that the function does not call another function that might be in another segment. Besides that, we don't like to mix styles and recommend writing normal functions in any case.

More in depth information on writing functions and the rules can be found in the [fundamentals section](../fundamentals/overview.md).
