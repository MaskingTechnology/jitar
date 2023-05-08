
# Jitar | Access Protection example

This example demonstrates how to protect the access to a procedure.

The application is a simple game that generates a random secret that needs to be guessed.
The procedure to get the secret has been made private to ensure it isn't accessible from outside its segment.

## Project setup

**Functions**

* checkSecret (`src/game/checkSecret.ts`)
* getSecret (`src/game/getSecret.ts`)

**Segments**

* Game - contains the *game* procedures (`segments/game.segment.json`)

**Services**

* Standalone - loads all segments (`services/standalone.json`)

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

The ``requests.http`` file contains example requests to call the procedures.
