
# Jitar | Run procedure hook example

This example demonstrates how the run procedure hook works.

The application consists of three simple procedures two segments and one segment.
All procedures are placed in the ``src/greetings`` directory. The segment file``(default.segment.ts)`` is placed in
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

The ``requests.http`` file contains example requests to call the procedure.
