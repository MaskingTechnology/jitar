
import InvalidPropertyType from './errors/InvalidPropertyType.js';
import Serializer from './interfaces/Serializer.js';
import SerializedMap from './types/SerializedMap.js';

import ValueSerializer from './ValueSerializer.js';

class MapSerializer implements Serializer
{
    serialize(map: Map<unknown, unknown>): SerializedMap
    {
        const keys: unknown[] = [];
        const values: unknown[] = [];

        for (const [key, value] of map)
        {
            keys.push(ValueSerializer.serialize(key));
            values.push(ValueSerializer.serialize(value));
        }

        return { serialized: true, name: 'Map', entries: { keys: keys, values: values } };
    }

    async deserialize(object: SerializedMap): Promise<Map<unknown, unknown>>
    {
        this.#validateSerializedMap(object);

        const keys = object.entries.keys;
        const values = object.entries.values;

        const result = new Map();

        for (let index = 0; index < keys.length; index++)
        {
            const key = await ValueSerializer.deserialize(keys[index]);
            const value = await ValueSerializer.deserialize(values[index]);

            result.set(key, value);
        }

        return result;
    }

    #validateSerializedMap(object: SerializedMap): void
    {
        if ((object.entries?.keys instanceof Array) === false)
        {
            throw new InvalidPropertyType('map', 'entries.keys', 'Array');
        }

        if ((object.entries?.values instanceof Array) === false)
        {
            throw new InvalidPropertyType('map', 'entries.values', 'Array');
        }
    }
}

const instance = new MapSerializer();

export default instance;
