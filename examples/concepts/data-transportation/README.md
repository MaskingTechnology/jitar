
# Jitar | Data Transportation example

This example demonstrates how data is transported between segments.

The application simulates a helpdesk where a person can register for an account.
It contains a registration process that creates and transports a data object.

## Project setup

**Functions**

* createAccount (`src/account/createAccount.ts`)
* register (`src/helpdesk/register.ts`)

**Data models**

* Account (`src/account/Account.ts`)
* Registration (`src/helpdesk/Registration.ts`)

**Segments**

* Account - contains the *account* procedures (`segments/account.segment.json`)
* Helpdesk - contains the *helpdesk* procedures (`segments/greeting.segment.json`)

**Services**

For development

* Standalone - loads all segments (`services/standalone.json`)

For production

* Repository (`services/repository.json`)
* Gateway (`services/gateway.json`)
* Account - loads the *account* segment (`services/account.json`)
* Helpdesk - loads the *helpdesk* segment (`services/helpdesk.json`)

## Running the example

1\. Install Jitar by running the following command from the root directory of the example.

```bash
npm install
```

2.\ Next, build the application by running the following command.

```bash
npm run build
```

To start Jitar we need four terminal sessions to start the repository, gateway, and nodes separately. The starting order is of importance.

**Repository** (terminal 1)

```bash
npm run repo
```

**Gateway** (terminal 2)

```bash
npm run gateway
```

**Account segment** (terminal 3)

```bash
npm run node-account
```

**Helpdesk segment** (terminal 4)

```bash
npm run node-helpdesk
```

The ``requests.http`` file contains example request to call the procedures. Note that the Account object is created on the *account* segment.
