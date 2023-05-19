---
layout: doc

prev:
    text: Debugging
    link: /develop/debugging

next:
    text: Segmentation
    link: /deploy/segmentation

---

# Integration
Jitar is designed to play well with others. An RPC API is provided that external applications can use to call functions. In this section you'll learn how to use the RPC API to make function calls.

## Making a call
Jitar automatically creates an endpoint for every segmented public function. The URL of the RPC endpoint is structured like this:

```http
GET http://{ server address }/rpc/{ fully qualified function name}?{ parameters } HTTP/1.1
```

Let's see how this works for the following simple [function](../develop/writing-functions.md):

```ts
// shared/sayHello.ts
export async function sayHello(name: string): Promise<string>
{
    return `Hello, ${name}!`;
}
```

That is added to a [segment configuration](../develop/creating-segments.md) with a public access:

```json
{
    "./shared/sayHello":
    {
        "sayHello": {  "access": "public" }
    }
}
```

After starting Jitar we can call the function with the following HTTP request:

```http
GET http://localhost:3000/rpc/shared/sayHello?name=John HTTP/1.1
```

The fully qualified function name (FQN) of a function also includes its location relative to the source folder, in this case `shared/sayHello`. At the start of Jitar all registered RPC entries are listed, so you can always find the FQN you need.

In the query string you can set the function parameter values by name. For functions that take more complex data as parameter values the POST method can be used:

```http
POST http://example.com:3000/rpc/shared/sayHello HTTP/1.1
content-type: application/json

{
    "name": "John"
}
```

The request body must always be a JSON object. The object properties must map the function's parameter names.

## Request parameters
Functions parameters can have many forms. Jitar has support for the following options.

### Optional parameters
Parameters with a default value are considered optional:

```ts
// shared/sayHello.ts
export async function sayHello(name = 'World'): Promise<string>
{
    return `Hello, ${name}!`;
}
```

This function can be called without a value for the name parameter:

```http
GET http://localhost:3000/rpc/shared/sayHello HTTP/1.1
```

### Destructured parameters
Functions can have (nested) destructured parameters:

```ts
import Person from './Person';

// shared/sayHello.ts
export async function sayHello({ name, address: { city } }: Person): Promise<string>
{
    return `Hello, ${name} from ${city}!`;
}
```

In the end, the function only has two parameters: name and city. When making a RPC call, these are the parameter values that need to be provided:

```http
GET http://localhost:3000/rpc/shared/sayHello?name=John&city=Rome HTTP/1.1
```

### Rest parameters
Functions can use the rest operator:

```ts
// shared/sayHello.ts
export async function sayHello(...names: string[]): Promise<string>
{
    return `Hello, ${names.join(', ')}!`;
}
```

RPC calls require the exact name of a parameter. In this case we also need to add the rest operator and provide an array with the values. In order to send the array we need to use the POST method:

```http
POST http://example.com:3000/rpc/shared/sayHello HTTP/1.1
content-type: application/json

{
    "...names": ["John", "Jane"]
}
```

### Class parameters
Functions can use built-in and custom class parameters. For example this function that takes a custom Person class instance:

```ts
// shared/sayHello.ts
import { Person } from './Person';

export async function sayHello(person: Person): Promise<string>
{
    return `Hello, ${person.name}!`;
}
```

The Person class looks like this:

```ts
// shared/Person.ts
export class Person
{
    #name: string;
    #age: number;

    constructor(name: string, age: number)
    {
        this.#name = name;
        this.#age = age;
    }

    get name(): string { return this.#name; }
    get age(): number { return this.#age; }
}
```

This class is immutable, so it can only be constructed with constructor arguments. To call this function we need to provide all information required to construct the instance:

```http
POST http://example.com:3000/rpc/shared/sayHello?serialize=true HTTP/1.1
content-type: application/json

{
    "person":
    {
        "serialized": true,
        "name": "Person",
        "source": "shared/Person.js",
        "args": ["John", 42],
        "fields": { }
    }
}
```

Note that the query string now contains a serialize parameter. This tells Jitar to use the serializer for the request body that defines the instance of the Person class:

* serialized - tells the serializer that this is an serialized object
* name - the name of the class
* source - the module file containing the class definition (relative to the source folder)
* args - the constructor arguments
* fields - the public field values

More information on serialization like how to deal with built-in classes can be found in the [data serialization section](../develop/data-sharing.md) of the Jitar internals.

## Response result
The RPC API translates the returned value of a function to a response. Non-object values will be translated to a string, object values to a JSON string.

Object values can be requested with or without the use of the serializer using the serialize query parameter:

```http
GET http://localhost:3000/rpc/person/getPerson?serialize={true | false} HTTP/1.1
```

For plain objects the result will be the same in both cases, but for class instances with private fields it makes a big difference. For example returning an instance of the following class:

```ts
export class Person
{
    #name: string;
    #age: number;

    constructor(name: string, age: number)
    {
        this.#name = name;
        this.#age = age;
    }

    get name(): string { return this.#name; }
    get age(): number { return this.#age; }
}

const person = new Person('John', 42);
```

Without the use of the serializer the RPC API will respond with an empty object because it can't read the private fields, and getters are ignored.

```json
{}
```

With the serializer the response looks very different:

```json
{
    "serialized": true,
    "name": "Person",
    "source": "shared/Person.js",
    "args": ["John", 42],
    "fields": { }
}
```

The serializer creates an object with a full description of the instance that is internally used for sharing data between servers. More information on serialization can be found in the [data serialization section](../develop/data-sharing.md) of the Jitar internals.

## Error handling
When a function throws an error during the execution of a PRC call, its response is automatically assigned to a http status code. By default the code `500` is used, which means that an Internal Server Error has occurred. When integrating with external applications this might not be what you want. If for example some item can not be found in the database, it's better to send a 404 status code.

Jitar provides a default set of error classes that you can use to control the status codes, like a `NotFound` class:

```ts
import { NotFound } from ‘jitar’;
import { Person } from './Person';

export async function getPerson(id: string): Person
{
    throw new NotFound('Person not found');
}
```

Here's the complete list of error classes you can use:

| Class | Http status code | 
| ----- | ---------------- |
| BadRequest | 400 |
| Unauthorized | 401 |
| PaymentRequired | 402 |
| Forbidden | 403 |
| NotFound | 404 |
| Teapot | 418 |
| NotImplemented | 501 |

Although there are many more status codes, we've started with the most important ones. If you need another code, don't hesitate [to contact us](https://discord.gg/Bqwy8azp5R){target="_blank"} or create a new [feature request](https://github.com/MaskingTechnology/jitar/issues/new?labels=feature,runtime&template=feature_request.md&title=New%20runtime%20error){target="_blank"}.

Besides throwing these errors directly, you can also use them as a base class for creating your own, more specific errors:

```ts
import { NotFound } from ‘jitar’;

export default PersonNotFound extends NotFound
{
    constructor()
    {
        super('Person not found');
    }
}
```

::: tip
Using Jitar errors in your application will lock you in. Therefore we recommend creating your own set of errors based on the Jitar errors and use these in your application. If you want to [migrate away from Jitar](../guides/migrate-away-from-jitar.md) you only need to update your errors.
:::

When building custom error classes always make sure they are serializable. If you need to add fields, always make sure they are publicly readable:

```ts
import { NotFound } from ‘jitar’;

export default PersonNotFound extends NotFound
{
    #id: string;

    constructor(id: string)
    {
        super(`Person not found for id ${id}`);

        this.#id = id;
    }

    get id(): string { return this.#id; }
}
```
