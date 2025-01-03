
# Jitar | Custom Error Handling example

This example demonstrates how custom errors are supported.

The application is a simple setup for exporting sales data.
Getting the data results into an error that is caught when trying to export it.

## Project setup

**Functions**

* getData (`src/sales/getData.ts`)
* exportData (`src/sales/exportData.ts`)

**Data model**

* DatabaseError (`src/sales/DatabaseError.ts`)

**Segments**

* Data - contains the *data* procedures (`segments/data.json`)
* Process - contains the *process* procedures (`segments/process.json`)

**Services**

Development

* Standalone - loads the *contact* and *organization* segments (`services/standalone.json`)

Production

* Repository (`services/repository.json`)
* Gateway (`services/gateway.json`)
* Data - loads the *contact* segment (`services/data.json`)
* Process - loads the *organization* segment (`services/process.json`)

## Running the example

1\. Install Jitar by running the following command from the root directory of the example.

```bash
npm install
```

2\. Next, build the application by running the following command.

```bash
npm run build
```

To start Jitar we need four terminal sessions to start the repository, gateway, and workers separately. The starting order is of importantance.

**Repository** (terminal 1)

```bash
npm run repo
```

**Gateway** (terminal 2)

```bash
npm run gateway
```

**Data segment** (terminal 3)

```bash
npm run worker-data
```

**Process segment** (terminal 4)

```bash
npm run worker-process
```

The ``requests.http`` file contains example requests to call the procedures.
