
# Jitar | Start Hooks example

This example demonstrates how the client and server start hooks work.

The client start hook can be used to start any client (browser or Node), and the server start hook can be used to start the Node server.

## Project setup

**Procedures**

* sayBoth (`src/greetings/sayBoth.ts`)
* sayHello (`src/greetings/sayHello.ts`)
* sayHi (`src/greetings/sayHi.ts`)

**Segments**

* Server - contains the *server* procedures (`segments/server.segment.json`)
* Client - contains the *client* procedures (`segments/client.segment.json`)

**Services**

* Standalone - loads the *Server* segments (`services/standalone.json`)

## Running the example

Install Jitar by running the following command from the root directory of the example.

```
npm install
```

Next build the application by running the following command.

```
npm run build
```

To start Jitar we need two terminal sessions to start the repository and the node client. The starting order is of importantance.

**Standalone** (terminal 1)
```
npm run standalone
```

**Node client** (terminal 2)
```
npm run client
```

Now open the following URL in your browser `http://localhost:3000`.

Both clients show the same result. The browser client as an alert, and the Node client in the terminal.
