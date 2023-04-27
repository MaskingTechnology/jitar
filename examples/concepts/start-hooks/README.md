
# Jitar | Start Hooks example

This example demonstrates how the client and server start hooks work.

The application consists of three simple procedures two segments and an ``index html``
file for bootstrapping the client. All procedures are placed in the ``src/greetings``
directory. The ``index html`` file and segment files ``(*.segment.ts)`` are placed in
the ``src`` directory.

For fireing up Jitar its configuration is specified in the ``jitar.json`` file.

## Running the example

Install Jitar by running the following command from the root directory of the example.

```
npm install
```

Next build the application by running the following command.

```
npm run build
```

Then start Jitar with the following command from the same directory.

```
npm run start
```

Now open the following URL in your browser ``http://localhost:3000``
