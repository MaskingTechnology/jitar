
# Jitar | Hello World example

This example demonstrates the simplest Jitar application possible.

The application says hello to the given name.

## Project setup

**Functions**

* sayHello (`src/sayHello.ts`)

**Segments**

* Default - contains the *sayHello* procedure (`segments/default.segment.json`)

**Services**

* Standalone (`services/standalone.json`)

## Running the example

1\. Install Jitar by running the following command from the root directory of the example.

```bash
npm install
```

2\. Next build the application by running the following command.

```bash
npm run build
```

3\. Then start Jitar with the following command from the same directory.

```bash
npm run standalone
```

The ``requests.http`` file contains example requests to call the procedure with the GET and POST method.
