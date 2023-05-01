
# Jitar | Custom Error Handling example

This example demonstrates how custom errors are supported.

The application contains a custom error and procedures to handle it.

## Project setup

**Procedures**

* getContacts (`src/contact/getContacts.ts`)
* getContactList (`src/organization/getContactList.ts`)

**Segments**

* Contact - contains all procedures (`segments/contact.segment.json`)
* Organization - contains all procedures (`segments/organization.segment.json`)

**Services**

Development

* Standalone - loads the *contact* and *organization* segments (`services/standalone.json`)

Production

* Repository (`services/repository.json`)
* Gateway (`services/gateway.json`)
* Node 1 - loads the *contact* segment (`services/node1.json`)
* Node 2 - loads the *organization* segment (`services/node2.json`)

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

**Hi segment** (terminal 3)
```
npm run node1
```

**Hello segment** (terminal 4)
```
npm run node2
```

The ``requests.http`` file contains example requests to call the procedures.
