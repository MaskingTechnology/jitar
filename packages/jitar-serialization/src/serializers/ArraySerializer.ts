
import ValueSerializer from '../ValueSerializer.js';

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

    async deserialize(values: unknown[]): Promise<unknown[]>
    {
        return await Promise.all(values.map(async (value) => await this.deserializeOther(value)));
    }
}
