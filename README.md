
# Jitar - Distributed runtime

Welcome to [Jitar](https://jitar.dev), a full-stack JavaScript runtime for small to large web applications. It lets you to build monolithic applications and run them spread out over multiple servers and web browsers. Jitar takes care of the inner communication, so you don't have to build any API.

Jitar is an abbreviation of **just-in-time architecture**, a flexible architecture style for building future-proof applications. Its intent is to close the gap between front- and back-end and provide a more cost efficient and flexible alternative to the microservice and serverless architecture (function as a service) types. With Jitar, applications can start as a monolith and be broken into smaller distributable pieces. It reduces the need for up-front architectural design and simplifies orchestration and deployment.

Jitar runs on top of Node.js and in any modern web browser. It has strong support for [TypeScript](https://www.typescriptlang.org/). Because it's only a runtime, you can use the frameworks you already love at the front- and back-end. It's easy to learn and use, and it has a very small footprint.

## Table of contents

* [Features](#features)
* [How it works](#how-it-works)
* [Getting started](#getting-started)
* [Example](#example)
* [Documentation](#documentation)
* [Contributing](#contributing)
* [Roadmap](#roadmap)

## Features

The main feature is writing monolithic applications that scale in any form and closes the gap between front- and back-end.
It doesn't matter if a component is placed on one of the servers or the web browser. Jitar will make it work using its powerful runtime features.

* **Segmentation** - Applications are broken down into servable segment packages.
* **Orchestration** - Procedures always run, no matter the segment they're placed in.
* **Load balancing** - Segments that are served by multiple servers are balanced automatically.
* **Access protection** - Private procedures are only available within its own segment.
* **Multi-version** - Procedures are versioned to support backwards compatibility.
* **Transportation** - Data gets (de)serialized automatically when shared between segments.
* **RPC calls** - Public procedures can be called from any external system.
* **And more** - There's also support for health checks, assets, hooks and more.

## How it works

In short, it comes down to this:

* **Applications** are broken down into components (procedures and objects).
* **Components** are grouped together in one or multiple segments and stored in a repository.
* **Segments** are deployed independently to one or multiple nodes (like a microservice, but dynamically composed).
* The **Repository** provides the actual or remote implementation of components to nodes (depending on their segment).
* **Nodes** load segments and runs their procedures when called by a client or gateway.
* The **gateway** keeps track of the available nodes and its components (locator).

The repository plays the biggest role when it comes to splitting applications. It holds the actual and a remote implementation for each segmented procedure. When starting a node, it loads the configured segments from the repository. If one of the segment components depends on (imports) a component from another segment, the repository will provide the remote implementation that calls the procedure using the gateway.

After a node starts successfully it will register itself to the gateway with all loaded procedures. If a procedure gets registered by multiple nodes, the gateway will automatically load balance the calls between them (round robin). When a node goes down it will automatically be unregistered. This means that it's possible to scale up and down nodes without any downtime.

## Getting started

Setting up Jitar is easy. It simply needs to be added as a NPM dependency to your application. Node.js version 18.7 or higher are required.

```bash
npm install jitar
```

Now you're ready to chop applications! Follow our [Getting started](https://jitar.dev/docs/02_getting_started) guide to create your first application.

## Example

The following example shows how a client imports and call a procedure from a server as if its locally available (like a monolith).

Components can be used typesafe because of the full Intellisense support. Also (complex) data objects can be exchanged between the procedures.

``src/client.ts``

```ts
import { storePerson } from './server';
import { Person } from './Person';

async function createPerson(name: string, age: number)
{
    const person = new Person(name, age);
    await storePerson(person);
}

export { createPerson }
```

A client can run in the browser or on a server. When running on a server, the client could also be a server for other clients by exposing some procedures.

Because Jitar is a runtime, any library or framework can be used.

``src/server.ts``

```ts
import { MongoClient as MC } from 'mongodb';
import { Person } from './Person';

async function storePerson(person: Person)
{
    const client = await MC.connect(process.env.DB_STRING);
    await client.db('my_app')
        .collection('people')
        .insertOne({ name: person.name, age: person.age });
}

export { storePerson }
```

For splitting (segmenting) applications configuration files are used. For each procedure the access and version can be controlled.

``server.segment.json``

```json
{
    "server.js": {
        "storePerson": {
            "access": "public",
            "version": "1.0.0"
        }
    }
}
```

## Documentation

Full documentation is online available at [docs.jitar.dev](https://docs.jitar.dev).

Please join our [Discord community](https://discord.gg/Bqwy8azp5R) for questions and discussions.

## Contributing

We welcome contributions to Jitar. Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## Roadmap

We are working hard towards a stable 1.0 release. Details can be found in our [roadmap](ROADMAP.md) document.
