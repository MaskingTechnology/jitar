---
layout: doc

prev:
    text: Writing functions
    link: /develop/writing-functions

next:
    text: Error handling
    link: /develop/error-handling

---

# Data sharing
Jitar makes sharing data between segments easy. But there is one thing to take into account. You'll learn all about it in this section.

::: info 
Most of what you're learning here is not Jitar specific and applies to building distributed systems in general.
:::

## Automatic (de)serialization
All parameters and return values are (de)serialized automatically for remote functions. Jitar provides a powerful (de)serializer that is able to transport any (complex) data type. By default all built-in JavaScript objects are supported like maps, sets, dates, etc. There's also support for custom classes.

## Using objects
When working with objects it's important to know that the other end always receives a copy of the object, and not the actual object itself. If you don't take this into account the application behaves differently in a distributed setup. Take for example the following setup:

```ts
// test.ts
import { Person } from './Person'; // type definition
import { modify } from './modify';

export async function test(): Promise<void>
{
    const person: Person = { name: 'John Doe', age: 42 };

    modify(person);

    console.log(person);
}

// modify.ts
import { Person } from './Person';

export async function modify(person: Person): Promise<void>
{
    person.name = 'Tarzan';
}
```

When running this example with both functions on the same end, the console shows the following result:

```ts
{
   name: "Tarzan",
   age: 42
}
```

But if we run the same example with both functions on another end, the console shows something else:

```ts
{
   name: "John Doe",
   age: 42
}
```

As you can see, the data hasn't been modified. This is because the modify function modifies a copy of the data instead of the actual data.

The solution is simple. By always returning the modified data and use this as a replacement on the other end we can avoid this situation:

```ts
// test.ts
import { Person } from './Person';
import { modify } from './modify';

export async function test(): Promise<void>
{
    // make this a let variable
    let person: Person = { name: 'John Doe', age: 42 };

    // overwrite the person object with the result
    person = modify(person);

    // problem solved
    console.log(person);
}

// modify.ts

import { Person } from './Person';

export async function modify(person: Person): Promise<Person>
{
    person.name = 'Tarzan';

    return person; // return the modified object
}
```

Running the updated example shows that we now get the correct result.

## Adding immutability
Although the solution above is simple, it's quite error prone. A better approach is to use immutable objects. These types of objects can not be changed after creation, forcing creating a new object for every modification.

For creating immutable objects we prefer to use classes that use a constructor for setting the values, and add getter functions for reading the values. For example:

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

    get description(): string {  `${name} is ${age} years old`; }
}
```

Note that the `#` makes the fields private. Private fields are not discoverable, readable and writable from outside the class scope.

::: warning 
Do not use TypeScript's private keyword, but always use `#` instead.
:::

Jitar understands this construction and will use the getter functions for reading the value, and the constructor for creating the instance. If a field can't be set using the constructor it tries to find a setter function in case the field is private.

::: warning
The constructor parameter names, and the getter / setter function names must match the field names. Otherwise Jitar won't be able to map the values.
:::

Using the class in our example looks like this:

```ts
// test.ts

import { Person } from './Person';
import { modify } from './modify';

export async function test(): Promise<void>
{
    // create new instance
    const person: Person = new Person( 'John Doe', 42);

    modify(person);

    console.log(person);
}

// modify.ts

import { Person } from './Person';

export async function modify(person: Person): Promise<Person>
{
    // trying to change the name results in an error,
    // so we need to create new instance
    return new Person('Tarzan', person.age);
}
```

Keep in mind that you must do the same for collection objects like arrays, maps and sets. The types of objects are not immutable, so they won't remind you!
