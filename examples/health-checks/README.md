
# Jitar | Health Check example

This example demonstrates how to create heath checks and request the health of a service.

There is no application for this example, only a health check that is registered at the Jitar server.

## Project setup

**Health checks**

* DatabaseHealthCheck (`src/DatabaseHealthCheck.ts`)

**Segments**

* None

**Services**

* Standalone - loads no segments (`services/default.json`)

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

The ``requests.http`` file contains example requests to call the procedure.
