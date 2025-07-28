
# Jitar | Middleware example

This example demonstrates how to create and add middleware.

The application implements a simple logging middleware.

## Project setup

**Functions**

* hello (`src/hello.ts`)
* ping (`src/ping.ts`)
* redirect (`src/redirect.ts`)

**Segments**

* Default - contains all the procedures (`src/segments/default.json`)

**Services**

* Standalone - contains all the middlewares (`src/services/standalone.json`)

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
