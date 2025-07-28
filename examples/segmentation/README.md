
# Jitar | Segmentation example

This example demonstrates how to distribute an application in production.

The application is a simple report creation that separates the data from the processing.

## Project setup

**Functions**

* getData (`src/reporting/getData.ts`)
* createStatistics (`src/reporting/createStatistics.ts`)
* createReport (`src/reporting/createReport.ts`)

**Segments**

* Data - contains the *data* procedure (`segments/data.json`)
* Process - contains the *process* procedures (`segments/process.json`)

**Services**

Development

* Standalone - loads both segments (`services/standalone.json`)

Production

* Repository (`services/repository.json`)
* Gateway (`services/gateway.json`)
* Data - loads the *data* segment (`services/data.json`)
* Process - loads the *process* segment (`services/process.json`)

## Running the example (production)

1\. Install Jitar by running the following command from the root directory of the example.

```bash
npm install
```

2\. Next, build the application by running the following command.

```bash
npm run build
```

To start Jitar we need four terminal sessions to start the repository, gateway, and workers separately. The starting order is of importance.

**Gateway** (terminal 1)

```bash
npm run gateway
```

**Data segment** (terminal 2)

```bash
npm run worker-data
```

**Process segment** (terminal 3)

```bash
npm run worker-process
```

The ``requests.http`` file contains example requests to call the procedures.
