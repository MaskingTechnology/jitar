
# Jitar | Contact list

This example contact list application is build with React, MongoDB and Jitar (ReMoJi stack).
It includes frontend and backend components and a database for storing contacts.

## Project setup

**Procedures**

* createId (`src/shared/common/createId.ts`)
* getCollection (`src/shared/common/getCollection.ts`)
* getDatabase (`src/shared/common/getDatabase.ts`)
* createContact (`src/shared/contact/createContact.ts`)
* deleteContact (`src/shared/contact/deleteContact.ts`)
* getContacts (`src/shared/contact/getContacts.ts`)

**Data model**

* DatabaseError (`src/shared/common/DatabaseError.ts`)
* Contact (`src/shared/contact/Contact.ts`)

**Segments**

* Server - contains all *shared* procedures (`segments/server.segment.json`)

**Services**

Development

* Standalone - loads all segments (`services/standalone.json`)

Production

* Repository (`services/repository.json`)
* Gateway (`services/gateway.json`)
* Proxy (`services/proxy.json`)
* Node - loads the *server* segment (`services/node.json`)

## Running the example

For running the example, Docker is required for setting up MongoDB.

1\. Install all dependencies by running the following command from the root directory of the example.

```bash
npm install
```

2\. Build the application from the same directory.

```bash  
npm run build
```

3\. Start MongoDB with docker-compose.

```bash
docker-compose up
```

4\. Start Jitar in development mode with the following command.

```bash
npm run standalone
```

5\. Open the following URL in your browser `http://localhost:3000`

The example uses our Vite plugin. To run Vite in dev mode (for HMR) use the following command.

```bash
npm run dev
```

The app is now also available under `http://localhost:5173/`.
Note that the Jitar instance needs to run beside Vite, otherwise the backend components won't be available.

## Running in production

To run the application in production mode, we need four terminal sessions to start the repository, gateway, node and proxy (as webserver) separately. The starting order is of importance.

**Repository** (terminal 1)

```bash
npm run repo
```

**Gateway** (terminal 2)

```bash
npm run gateway
```

**Node** (terminal 3)

```bash
npm run node
```

**Proxy** (terminal 4)

```bash
npm run proxy
```

Now open the following URL in your browser `http://localhost:8080`
