
# Jitar | Multi Version example

This example demonstrates how to create multiple versions for a procedure and how to register them as versioned procedures in a segment.

The application is a simple application that returns information about a person and an organization. Each of these entities has a version 1 and version 2 of the procedure to get its details.

## Project setup

**Procedures**

* getEmployeeDetails (`src/employees/getDetails.ts`)
* getEmployeeDetailsV2 (`src/employees/getDetails.ts`)
* getOrganizationDetails (`src/organizations/getDetails.ts`)
* getOrganizationDetailsV2 (`src/organizations/getDetailsV2.ts`)

**Segments**

* Server - contains all procedures (`segments/server.segment.json`)

**Services**

* Standalone - loads the *Server* segment (`services/standalone.json`)

## Running the example

Install Jitar by running the following command from the root directory of the example.

```
npm install
```

Next build the application by running the following command.

```
npm run build
```

Then start Jitar with the following command from the same directory.

```
npm run standalone
```

The ``requests.http`` file contains example requests to call the procedure.
