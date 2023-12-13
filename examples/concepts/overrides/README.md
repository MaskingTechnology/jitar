
# Jitar | Hello World example

This example demonstrates how to override module imports.

The application overrides sayHello module with the sayBye module.

## Project setup

**Functions**

* sayBye (`src/sayBye.ts`)
* sayHello (`src/sayHello.ts`)
* saySomething (`src/saySomething.ts`)

**Segments**

* Default - contains the *sayHello* procedure (`segments/default.segment.json`)

**Services**

* Standalone (`services/standalone.json`)

## Running the example

1\. Install Jitar by running the following command from the root directory of the example.

```bash
npm install
```

2\. Next, build the application by running the following command.

```bash
npm run build
```

3\. Then start Jitar with the following command from the same directory.

```bash
npm run standalone
```

The ``requests.http`` file contains example requests to call the seyHello and saySomething procedures.
