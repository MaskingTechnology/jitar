
# Jitar | Load Balancing example

This example demonstrates how to load balance application segments by running them on multiple nodes.

The application contains simple calculator tasks that are placed in a single segment.

## Project setup

**Procedures**

* add (`src/calculator/add.ts`)
* subtract (`src/calculator/subtract.ts`)
* multiply (`src/calculator/multiply.ts`)
* divide (`src/calculator/divide.ts`)

**Segments**

* Calculator - contains all procedures (`segments/calculator.segment.json`)

**Services**

Development

* Standalone - loads the *calculator* segment (`services/standalone.json`)

Production

* Repository (`services/repository.json`)
* Gateway (`services/gateway.json`)
* Node 1 - loads the *calculator* segment (`services/node1.json`)
* Node 2 - loads the *calculator* segment (`services/node2.json`)

## Running the example (load balanced)

1\. Install Jitar by running the following command from the root directory of the example.

```bash
npm install
```

2\. Next build the application by running the following command.

```bash
npm run build
```

To start Jitar we need four terminal sessions to start the repository, gateway, and nodes separately. The starting order is of importantance.

**Repository** (terminal 1)

```bash
npm run repo
```

**Gateway** (terminal 2)

```bash
npm run gateway
```

**Node 1** (terminal 3)

```bash
npm run node1
```

**Node 2** (terminal 4)

```bash
npm run node2
```

The ``requests.http`` file contains example request to call the procedure.
Note that the requests are handled round robin by both nodes per procedure.