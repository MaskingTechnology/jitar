
# Deno server implementation for jitar!

We have plans to implement a [Deno](https://deno.land/) server for [Jitar](https://jitar.dev). We've put some work in getting the implementation running, but we need too many exceptions and manual interventions to make it work.

The easiest way to run a jitar application on deno is to import the npm package in the starter file.

```js
import { startServer } from 'npm:jitar-nodejs-server@^0.1.0';

const moduleImporter = async (specifier) => import(specifier);

startServer(moduleImporter);
```

As you can see in the starter file above, you'll need to write JavaScript for Jitar to work on deno. TypeScript doesn't work because the repository requires JavaScript in order to function. Or you'll need to copy the generated JavaScript files from the Deno cache to a ``dist`` folder and remove the .ts from the generated .ts.js extension.

We also ran into caching issues, where application updates do not have any effect after restarting Jitar. The command ``deno cache --reload my_module.js`` doesn't work for this. So, as long as you code everything correctly the first time, you won't have these issues ;-)

If you are a deno specialist and can help us out, let's know!

For more information about Jitar:

* [Visit our website](https://jitar.dev)
* [Read the documentation](https://docs.jitar.dev).
