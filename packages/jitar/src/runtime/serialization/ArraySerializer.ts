
import Serializer from './interfaces/Serializer.js';
import ValueSerializer from './ValueSerializer.js';

class ArraySerializer implements Serializer
{
    serialize(array: unknown[]): unknown[]
    {
        const values: unknown[] = [];

        for (const value of array)
        {
            values.push(ValueSerializer.serialize(value));
        }

        return values;
    }

    async deserialize(values: unknown[]): Promise<unknown[]>
    {
        return await Promise.all(values.map(async (value) => await ValueSerializer.deserialize(value)));
    }
}

const instance = new ArraySerializer();

export default instance;
