
#  Jitar Serialization

This package provides extensible serialization for automating end-to-end data transportation. It's used in the [Jitar](https://jitar.dev) project, but can also be used as standalone library in any project.

By default it supports:

* Primitives (bool, number, string, etc.)
* Arrays / Maps / Sets
* Objects / Classes
* Typed Arrays (Data buffer)

You can also write and add your own.

## Installation

To add this package to your project run:

```bash
npm install @jitar/serialization
```

## Basic usage

Serializers are created by the `SerializerBuilder` class. Once a serializer is created it can be used for serialization and deserialization of all type of values mentioned above.

```ts
import { SerializerBuilder } from 'jitar-serializer';

const set = new Set().add('apple').add('banana');
const map = new Map().set('bicycle', 1).set('car', 2).set('plane', 3);
const array = [ set, map ];

const serializer = SerializerBuilder.build();
const serializedArray = serializer.serialize(array);
const deserializedArray = serializer.deserialize(serializedArray);

console.log(deserializedArray);

// [
//   Set(2) { 'apple', 'banana' },
//   Map(3) { 'bicycle' => 1, 'car' => 2, 'plane' => 3 }
// ]
```

## Class serialization

In order to (de)serialize class instances, the serializer needs to know the source location of the class so it can be imported and instantiated. The source must be defined as a class property.

```ts
import { SerializerBuilder, Loadable } from 'jitar-serializer';

class Person
{
    #name: string;
    #age: string;

    construction(name: string, age: string)
    {
        this.#name = name;
        this.#age = age;
    }

    get name() { return this.#name; }
    get age() { return this.#name; }

    toString(): string { `${this.#name} is ${this.#age}` }
}

// Set the source like this
(Person as Loadable).source = import.meta.url;

const peter = new Person('Peter', 42);

const serializer = SerializerBuilder.build();
const serializedPeter = serializer.serialize(peter);
const deserializedPeter = serializer.deserialize(serializedPeter);

console.log(deserializedPeter.toString()); // Peter is 42
```

## Bring your own class loader

The `SerializerBuilder` uses a default class loader if no other loader is provided. This is fine is most cases, but for other cases you can implement your own class loader.

```ts
import { ClassLoader } from 'jitar-serializer';

export default class MyClassLoader implements ClassLoader
{
    async loadClass(loadable: Loadable): Promise<Function>
    {
        // Do your magic here.
        // The Loadable type provides the source and the class name.
    }
}
```

Simply provide your class loader to the `SerializerBuilder` to use it.

```ts
import { SerializerBuilder } from 'jitar-serializer';
import MyClassLoader from './MyClassLoader';

const serializer = SerializerBuilder.build(new MyClassLoader());

// The serializer now uses your class loader
```

## Extending the serializer

You can write and add your own (de)serializers by extending the `ValueSerializer` and implement its four abstract functions.

1. `canSerialize` - check if the value meets all the requirements to be serialized by this serializer.
1. `canDeserialize` - check if the value meets all the requirements to be deserialized by this serializer.
1. `serialize` - serialize the value.
1. `deserialize` - deserialize the value.

For example, this is how the `ArraySerializer` looks like.

```ts
import { ValueSerializer } from 'jitar-serializer';

export default class ArraySerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return value instanceof Array;
    }

    canDeserialize(value: unknown): boolean
    {
        return value instanceof Array;
    }
    
    async serialize(array: unknown[]): Promise<unknown[]>
    {
        const values: unknown[] = [];

        for (const value of array)
        {
            values.push(await this.serializeOther(value));
        }

        return values;
    }

    async deserialize(array: unknown[]): Promise<unknown[]>
    {
        return await Promise.all(array.map(async (value) => await this.deserializeOther(value)));
    }
}
```

The `this.deserializeOther(value)` function lets the main serializer handle the serialization of the (unknown) sub value.

Value serializers can easily be added to the main serializer.

```ts
import { SerializerBuilder } from 'jitar-serializer';
import MySerializer from './MySerializer';

const serializer = SerializerBuilder.build();
serializer.addSerializer(new MySerializer());

// Your serializer is now being used
```

Last added value serializers are first in line to check if they can (de)serialize a value. This means that you can override any of the default serializers.
