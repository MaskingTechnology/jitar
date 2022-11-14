
import InvalidPropertyType from './errors/InvalidPropertyType.js';
import Serializer from './interfaces/Serializer.js';
import SerializedSet from './types/SerializedSet.js';

import ValueSerializer from './ValueSerializer.js';

class SetSerializer implements Serializer
{
    serialize(set: Set<unknown>): SerializedSet
    {
        const values: unknown[] = [];

        for (const value of set.values())
        {
            values.push(ValueSerializer.serialize(value));
        }

        return { serialized: true, name: 'Set', values: values };
    }

    async deserialize(object: SerializedSet): Promise<Set<unknown>>
    {
        this.#validateSerializedSet(object);

        const values = await Promise.all(object.values.map(async (value: unknown) => await ValueSerializer.deserialize(value)));

        return new Set([...values]);
    }

    #validateSerializedSet(object: SerializedSet): void
    {
        if ((object.values instanceof Array) === false)
        {
            throw new InvalidPropertyType('set', 'values', 'Array');
        }
    }
}

const instance = new SetSerializer();

export default instance;
