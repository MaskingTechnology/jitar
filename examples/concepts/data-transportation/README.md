
# Jitar | Data Transportation example

This example demonstrates how data is transported between segments.

The application consists of two simple procedures, a data model class and two segments. The object created on one segment is passed to the other segment.

## Project setup

**Procedures**

* createPerson (`src/person/createPerson.ts`)
* sayHello (`src/person/sayHello.ts`)

**Data model**

* Person (`src/person/Person.ts`)

**Segments**

* Data - contains the createPerson procedure and the data model (`segments/data.segment.json`)
* Greeting - contains the sayHello procedure (`segments/greeting.segment.json`)

**Services**

For development

* Standalone - loads both segments (`services/data.json`, `services/greeting.json`)

For production

* Repository (`services/repository.json`)
* Gateway (`services/gateway.json`)
* Node 1 - loads the *greeting* segment (`services/node1.json`)
* Node 2 - loads the *data* segment (`services/node2.json`)

## Running the example

Install Jitar by running the following command from the root directory of the example.

```
npm install
```

Next build the application by running the following command.

```
npm run build
```

To start Jitar we need four terminal sessions to start the repository, gateway, and nodes separately. The starting order is of importantance.

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

The ``requests.http`` file contains example requests to call the procedures. Note that the Person object is created on the *data* segment and then passed to the *greeting* segment to say hello.
