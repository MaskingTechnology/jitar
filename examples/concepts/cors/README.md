
# Jitar | Cors example

This example demonstrates how to enable CORS.

The application contains a single procedure that returns a message. The index.html file contains a simple form that calls the procedure and displays the result.

## Project setup

**Procedures**

* serve (`src/server/serve.ts`)

**Segments**

* Server - contains the *server* procedures (`segments/server.segment.json`)

**Services**

Development

* Standalone - loads the *server* segment (`services/standalone.json`)

Production

* Repository (`services/repository.json`)
* Gateway (`services/gateway.json`)
* Node 1 - loads the *server* segment (`services/node1.json`)
* Node 2 - loads the *server* segment (`services/node2.json`)

## Running the example

Install Jitar by running the following command from the root directory of the example.

```
npm install
```

Next build the application by running the following command.

```
npm run build
```

To start Jitar we need four terminal sessions to start the repository, gateway, and nodes separately. The starting order is of importantance.

**Repository** (terminal 1)
```
npm run repo
```

**Gateway** (terminal 2)
```
npm run gateway
```

**Node** (terminal 3)
```
npm run node1
```

**Node 2** (terminal 4)
```
npm run node2
```
