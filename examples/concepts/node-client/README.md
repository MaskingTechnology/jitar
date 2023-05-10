
# Jitar | Start Hooks example

This example demonstrates how to set up a node client.

The application draws a random lucky number.
The client connects to the Jitar server and gets a number.

## Project setup

**Functions**

* getLuckyNumber (`src/getLuckyNumber.ts`)

**Segments**

* Client - contains the *client* procedures (`segments/client.segment.json`)

**Services**

* Standalone - loads no segments (`services/standalone.json`)

## Running the example

1\. Install Jitar by running the following command from the root directory of the example.

```bash
npm install
```

2\. Next build the application by running the following command.

```bash
npm run build
```

To start Jitar we need two terminal sessions to start the server and the node client. The starting order is of importance.

**Standalone** (terminal 1)

```bash
npm run standalone
```

**Node client** (terminal 2)

```bash
npm run client
```

The lucky number is printed to the console.
