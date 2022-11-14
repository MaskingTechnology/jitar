---
layout: default
title: Basic features
---

# Basic features

In this section we will look at the basic features of Jitar. Each feature will be explained with an example based on the ``Hello World`` example from the [getting started](02_getting_started) page. All examples are available on [GitHub](https://github.com/MaskingTechnology/jitar){:target="_blank"} as separate projects.

---

## Segmentation

A segment is a physical separatable group of procedures. Depending on the size, complexity and type of application its procedures can be put into a single segment (like a monolith) or multiple segments (like microservices). The segmentation of an application is dynamic and can change without touching any line code.

Let's extend the *Hello World* application with a second segment. Before we can create the segment, we need to add more procedures first. The first is a simple alternative for the ``sayHello`` procedure.

{:.filename}
src/greetings/sayHi.ts

```ts
export default async function sayHi(name: string): Promise<string>
{
    return `Hi ${name}`;
}
```

The second procedure runs both the ``sayHello`` and ``sayHi`` procedures and combines the results. Procedures (and classes) can be statically imported using the ES module syntax, even if they will be placed on another segment.

{:.filename}
src/greetings/sayBoth.ts

```ts
import sayHi from './sayHi.js';
import sayHello from './sayHello.js';

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    // This procedure will always be called locally because its
    // in the same segment.
    const hiMessage = await sayHi(firstName);

    // This procedure will be called remotely in production mode
    // because its placed in another segment.
    const helloMessage = await sayHello(firstName, lastName);

    return `${hiMessage}\n${helloMessage}`;
}
```

All components are imported from the repository, so there is control over the returned implementation. If a procedure (component) runs on another node, it will import a remote procedure call instead of the actual procedure.

{:.alert-info}
Procedure functions **need to be async** in order to be able to split applications.

Segment files are used for bundling procedures into servable packages. A procedure must be registered in a segment file in order to be remotely accessible. Procedures can also be registered in multiple segments for optimization reasons (e.g. avoid unnecessary network traffic).

{:.alert-warning}
Unsegmented procedures should only be used locally to avoid import issues.

For this example we can create two segment files. The first segment file will only contain the ``sayHello`` procedure.

{:.filename}
segments/hello.segment.json

```json
{
    "./greetings/sayHello.js": {
        "default": {
            "access": "public"
        }
    }
}
```

The second segment file bundles the ``sayHi`` and ``sayBoth`` procedures.

{:.filename}
segments/hi.segment.json

```json
{
    "./greetings/sayHi.js": {
        "default": {
            "access": "public"
        }
    },
    "./greetings/sayBoth.js": {
        "default": {
            "access": "public"
        }
    }
}
```

Now we can setup a cluster and load the two segments in separated nodes and use a gateway for the orchestration.

{:.alert-warning}
The name of the segment file is important and must always end with ``.segment.json`` in order to be found and loaded.

When the cluster is started, the ``sayHello`` procedure will run on the ``hello`` node and the ``sayHi`` and ``sayBoth`` procedures run on the ``hi`` node. When running the ``sayBoth`` procedure, the ``sayHello`` procedure will be called remote from the ``hello`` node.

```http
GET http://app.example.com:3000/rpc/greetings/sayHi?firstName=John HTTP/1.1
```

```http
GET http://app.example.com:3000/rpc/greetings/sayHello?firstName=Jane HTTP/1.1
```

```http
GET http://app.example.com:3000/rpc/greetings/sayBoth?firstName=Jim&lastName=Doe HTTP/1.1
```

---

## Orchestration

Orchestration is the process of finding and running segmented procedures that are spread over multiple nodes. The [gateway](03_runtime_services#gateway) is responsible for this task and keeps track of all nodes and the procedures they contain.

Besides configuring the segmentation, no extra configuration is needed. When a node is started, it will register itself at the gateway. When a procedure is called, the gateway will find the node that contains the procedure and forward the request to that node.

---

## Load balancing

Procedures are automatically load balanced when registered at the gateway by multiple nodes. The gateway uses the [round robin](https://en.wikipedia.org/wiki/Round-robin_scheduling){:target="_blank"} algorithm to equally divide the load over the available nodes. When a node goes down it will automatically be unregistered. This means that it’s possible to scale up and down nodes without any downtime.

{:.alert-warning}
The gateway is version unaware and will load balance based on procedure name.

To demonstrate the load balancing, we can simply spin up multiple nodes with the ``hello.segment.json`` from the segmentation section.

{:.filename}
conf/node.json

```json
{
    "mode": "node",
    "url": "http://node.example.com:3000",
    "gateway": "http://app.example.com:3000",
    "repository": "http://repository.example.com:3000",
    "segments": [ "hello" ]
}
```

By running the ``sayHello`` procedure multiple times we can see how the load is divided.

```http
GET http://app.example.com:3000/rpc/greetings/sayHello?firstName=John HTTP/1.1
```

{:.alert-info}
If a procedure is placed in multiple segments, the procedure will be load balanced over all nodes containing one of its segments. To exclude a procedure from being load balanced from a specific segment, the procedure can be set to private in the segment file.

---

## Access protection

Procedures are not accessible by default. This means that they cannot be called from the outside world using the [RPC API](05_advanced_features#apis). To enable the access of a procedure, it has to be made public. We have done this throughout the examples by setting the **access** to **public** in the segment files.

We've used the *Hello World* application from the [getting started page](02_getting_started) for the example. You can also use the example from the [GitHub repository](https://github.com/MaskingTechnology/jitar){:target="_blank"}.

We will need to add a new procedure that will call a private procedure.

{:.filename}
src/greetings/sayHelloPublic.ts

```ts
import sayHello from './sayHello.js';

export default async function sayHelloPublic(firstName: string): Promise<string>
{
    return await sayHello(firstName);
}
```

In the segment the *sayHelloPublic* needs to be registered as a public procedure. The original sayHello needs to be set to private.

{:.filename}
default.segment.json
```json
{
    "./greetings/sayHelloPublic.js": {
        "default": {
            "access": "public"
        }
    },
    "./greetings/sayHello.js": {
        "default": {
            "access": "private"
        }
    }
}
```

Trying to run a private procedure will result in a ``404 - procedure not found`` response.

```http
GET http://app.example.com:3000/rpc/greetings/sayHello?name=John HTTP/1.1
```

Running the public procedure will return the contents of the private function.

```http
GET http://app.example.com:3000/rpc/greetings/sayHelloPublic?firstName=John HTTP/1.1
```

---

## Multi-version

During their lifetime procedures can change for many reasons. To avoid impact on dependent procedures (or external systems), procedures can be versioned and run per version.

The version system works with a three number system: major, minor and patch. By default all procedures have the version ``0.0.0``. This version can be overridden by setting the version in the segment file.

The following example shows how to create a new version of the ``sayHello`` procedure.

{:.filename}
src/greetings/sayHello_v1_0_0.ts

```ts
export default async function sayHello(firstName: string, lastName: string): Promise<string>
{
    return `Hello ${firstName} ${lastName}`;
}
```

The new procedure version must also be added to the segment file(s) in order to become available.

{:.filename}
default.segment.json

```json
{
    "./greetings/sayHello.js": {
        "default": {
            "access": "public"
        }
    },
    "./greetings/sayHello_v1_0_0.js": {
        "default": {
            "access": "public",
            "version": "1.0.0"
        }
    }
}
```

Version numbers should be set as a string containing one to three numbers separated by dots. The version number can be any number, but it is recommended to use the [semantic versioning](https://semver.org/){:target="_blank"} system.

{:.alert-warning}
An ``Invalid version number`` error will be thrown when the version number does not have to correct format.

Procedures are identified by the function name by default. That's why we've created a new file for the new version. It's also possible to bundle multiple versions into a single file like this.

{:.filename}
src/greetings/sayHello.ts

```ts
export async function sayHello_v0_0_0(name: string): Promise<string>
{
    return `Hello ${name}`;
}

export async function sayHello_v1_0_0(firstName: string, lastName: string): Promise<string>
{
    return `Hello ${firstName} ${lastName}`;
}
```

The segment file needs to be updated to include both versions from the same file.

{:.filename}
default.segment.json

```json
{
    "./greetings/sayHello.js": {
        "sayHello_v0_0_0": {
            "as": "sayHello",
            "access": "public",
            "version": "0.0.0"
        },
        "sayHello_v1_0_0": {
            "as": "sayHello",
            "access": "public",
            "version": "1.0.0"
        }
    }
}
```

{:.alert-info}
All procedure versions should stick together in the same segment(s).

Both versions can be run individually. The following RPC call can be used to run the default version (v0.0.0).

```http
GET http://app.example.com:3000/rpc/greetings/sayHello?version=0.0.0&name=Jane HTTP/1.1
```

For running the new version, a version parameter can be added to the RPC call. The following RPC call can be used to run the new version (v1.0.0).

```http
GET http://app.example.com:3000/rpc/greetings/sayHello?version=1.0.0&firstName=Jim&lastName=Doe HTTP/1.1
```

---

## Data transportation

Procedures can make use of a broad variety of data types. When sharing data between nodes, the data will be automatically (de)serialized. The following data types are supported:

* Primary types (string, number, boolean, null, undefined)
* Collection types (array, set, map)
* Object types (plain objects, class objects, dates)

Any class object can be transported as long as it can be reconstructed. Private fields are supported, but need access through the constructor or getter / setter. Otherwise, their value will get lost in the transportation process.

Let's look at an example class.

{:.filename}
src/greetings/Person.ts

```ts
export default class Person
{
    #firstName: string;
    #lastName: string;

    constructor(firstName: string, lastName: string)
    {
        this.#firstName = firstName;
        this.#lastName = lastName;
    }

    get firstName() { return this.#firstName; }

    get lastName() { return this.#lastName; }

    get fullName() { return `${this.#firstName} ${this.#lastName}`; }
}
```

If a class object is transported between nodes, it's class definition doesn't have to be added to a segment file. All unsegmented components are considered sharable and can be requested at the repository. This means that they can be imported and used in any procedure.

We’ll use the ``Person`` class in the ``sayHello`` procedure as an example to transfer the person's name.

{:.filename}
src/greetings/sayHello.ts

```ts
import Person from './Person.js';

export default async function sayHello(person: Person): Promise<string>
{
    return `Hello ${person.fullName}`;
}
```

The same can be done for the ``sayHi`` procedure. In the ``sayBoth`` procedure we simply create a new ``Person`` object and pass it to the other procedures. When running this example segmented on a cluster, the ``Person`` object will be transported between the nodes.

{:.filename}
src/greetings/sayBoth.ts

```ts
import Person from './Person.js';

import sayHi from './sayHi.js';
import sayHello from './sayHello.js';

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    const person = new Person(firstName, lastName);

    const hiMessage = await sayHi(person);
    const helloMessage = await sayHello(person);

    return `${hiMessage}\n${helloMessage}`;
}
```

---

## Error handling

For handling errors the default JavaScript error system can be used for throwing and catching errors. If an error occurs it will be passed to the calling procedure until it's catched like any normal JavaScript application. If the error is thrown by a remote procedure the error will be (de)serialized and rethrown on the calling node.

Errors will be supplemented with remote tracing information to make sure its origin is known, even in a distributed setup. If we for example throw an error in the ``sayHello`` procedure from the data transportation example, it looks like this.

```ts
import Person from './Person.js';

export default async function sayHello(person: Person): Promise<string>
{
    throw new Error('Oops... Something went wrong');
}
```

When calling the ``sayBoth`` procedure using the RPC API, it will result in the following error message.

```text
Oops... Something went wrong
[greetings/sayHello | v0.0.0]
[greetings/sayBoth | v0.0.0]
```

The Error can also be catched in the ``sayBoth`` procedure.

{:.filename}
src/greetings/sayBoth.ts

```ts
import Person from './Person.js';

import sayHi from './sayHi.js';
import sayHello from './sayHello.js';

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    const person = new Person(firstName, lastName);

    try
    {
        const hiMessage = await sayHi(person);
        const helloMessage = await sayHello(person);

        return `${hiMessage}\n${helloMessage}`;
    }
    catch (error: any)
    {
        return error.message;
    }
}
```

Besides the standard Error class, custom error classes are supported.

{:.filename}
src/greetings/CustomError.ts

```ts
export default class CustomError extends Error
{
    constructor(message: string)
    {
        super(message);
        
        this.name = 'CustomError';
    }
}
```

---

{:.previous-chapter}
[Runtime services](03_runtime_services)

{:.next-chapter}
[Advanced features](05_advanced_features)
