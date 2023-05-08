
# Jitar | Multi Version example

This example demonstrates how to create multiple versions for a procedure and how to register them as versioned procedures in a segment.

The application holds two different versions of an employee.
Both versions can be requested independently.

## Project setup

**Functions**

* getEmployee (`src/getEmployee.ts`)
* getEmployeeV2 (`src/getEmployee.ts`)

**Segments**

* Default - contains all procedures (`segments/default.segment.json`)

**Services**

* Standalone - loads the *Default* segment (`services/standalone.json`)

## Running the example

1\. Install Jitar by running the following command from the root directory of the example.

```bash
npm install
```

2\. Next build the application by running the following command.

```bash
npm run build
```

3\. Then start Jitar with the following command from the same directory.

```bash
npm run standalone
```

The ``requests.http`` file contains example requests to call the procedure.
