
# Jitar | Access Protection example

This example demonstrates how to protect the access to a procedure.

The application is a simple game that generates a random secret that needs to be guessed.
The procedure to guess the secret is public and can be called by anyone.
The procedure to check the secret is protected and can only get called from outside its segment if the caller is trusted.
The procedure to get the secret has been made private to ensure it isn't accessible from outside its segment.

## Project setup

**Functions**

* guessSecret (`src/web/guessSecret.ts`)
* checkSecret (`src/game/checkSecret.ts`)
* getSecret (`src/game/getSecret.ts`)

**Segments**

* Web - contains the *web* procedures (`segments/web.json`)
* Game - contains the *game* procedures (`segments/game.json`)

**Services**

For development

* Standalone - loads all segments (`services/standalone.json`)

For production

* Repository (`services/repository.json`)
* Gateway (`services/gateway.json`)
* Web - loads the *web* segment (`services/web.json`)
* Game - loads the *game* segment (`services/game.json`)

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

The ``requests.http`` file contains example requests to call the procedures.
