
# Jitar | Middleware example

This example demonstrates how to create and add middleware.

The application contains a simple "Hello World" procedure that returns a string.
It can be found in the ``src/greetings`` directory. Also the application contains
the ``src/LoggingMiddleware.ts`` middleware file and the ``src/default.segment.ts``
segment file.

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

The ``requests.http`` file contains an example request to call the procedure.
