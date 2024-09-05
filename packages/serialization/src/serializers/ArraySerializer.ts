
import ValueSerializer from '../ValueSerializer';

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
        return Promise.all(array.map(async (value) => this.deserializeOther(value)));
    }
}
