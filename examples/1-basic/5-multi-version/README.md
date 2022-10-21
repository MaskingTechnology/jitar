
# Jitar | Multi Version example

This example demonstrates how to create multiple versions for a procedure.

The application consists of a single procedure with two versions. All procedure is placed in the
``src/greetings`` directory. The segment file ``(default.segment.json)`` is placed in the ``src`` directory.

The Jitar configuration is specified in the ``jitar.json`` file.

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
