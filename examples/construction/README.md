
# Jitar | Construction example

This example demonstrates how to construct and deconstruct a Jitar application.

The application creates and fills a database before the server starts.
When the application gets shut down, the database gets cleared.

## Project setup

**Functions**

* getData (`src/getData.ts`)

**Segments**

* Default - contains the *getData* procedure (`segments/default.json`)

**Services**

* Standalone (`services/standalone.json`)

## Running the example

1\. Install Jitar by running the following command from the root directory of the example.

```bash
npm install
```

2\. Next, build the application by running the following command.

```bash
npm run build
```

3\. Then start Jitar with the following command from the same directory.

```bash
npm run standalone
```

The ``requests.http`` file contains an example request to call the procedure.
