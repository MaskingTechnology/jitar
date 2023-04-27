
# Jitar | Hello World example

This example demonstrates the simplest Jitar application possible.
It contains a single backend procedure and does not have a frontend.
Therefore the procedure needs to be called using the RPC API.

## Project setup

**Procedures**

* sayHello (`src/sayHello.ts`)

**Segments**

* Default - contains the *sayHello* procedure (`segments/default.segment.json`)

**Services**

* Standalone (`services/standalone.json`)

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
npm run standalone
```

The ``requests.http`` file contains example requests to call the procedure with the GET and POST method.
