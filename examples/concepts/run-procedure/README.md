
# Jitar | Run procedure hook example

This example demonstrates how the run procedure hook works.

The application is a simple phonebook application. The model of the contacts in the phonebook has been updated in the latest version. The procedure to print the contact information has been updated, but the overview procedure has not. It uses the run procedure hook to dynamically call the correct version of the print procedure.

The run procedure hook is a powerful function to dynamically switch between versions of procedures. Using this hook breaks the IntelliSense support in Visual Studio Code. It is recommended to use the run procedure hook only when necessary.

## Project setup

**Procedures**

* getContactOverview (`src/app/getContactOverview.ts`)
* printContactInformation (`src/contact/printContactInformation.ts`)

**Segments**

* Default - contains all procedures (`segments/default.segment.json`)

**Services**

* Standalone - loads the *Default* segment (`services/standalone.json`)

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
