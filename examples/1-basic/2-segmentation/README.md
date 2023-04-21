
# Jitar | Segmentation example

This example demonstrates how to distribute an application in production.

The application is a simple report creation that separates the data from the processing.

## Project setup

**Procedures**

* getData (`src/reporting/getData.ts`)
* createStatistics (`src/reporting/createStatistics.ts`)
* createReport (`src/reporting/createReport.ts`)

**Segments**

* Data - contains the *multiply* procedure (`segments/data.segment.json`)
* Process - contains the *createReport* and *process* procedures (`segments/process.segment.json`)

**Services**

Development

* Standalone - loads both segments (`services/standalone.json`)

Production

* Repository (`services/repository.json`)
* Gateway (`services/gateway.json`)
* Node 1 - loads the *data* segment (`services/node1.json`)
* Node 2 - loads the *process* segment (`services/node2.json`)

## Running the example (production)

Install Jitar by running the following command from the root directory of the example.

```
npm install
```

Next build the application by running the following command.

```
npm run build
```

To start Jitar we need four terminal sessions to start the repository, gateway, and nodes separately. The starting order is of importance.

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
