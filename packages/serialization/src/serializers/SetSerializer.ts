
import ValueSerializer from '../ValueSerializer';
import SerializedSet from '../types/serialized/SerializedSet';

export default class SetSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return value instanceof Set;
    }

    canDeserialize(value: unknown): boolean
    {
        const set = value as SerializedSet;

        return set instanceof Object
            && set.serialized === true
            && set.name === 'Set'
            && set.values instanceof Array;
    }

    async serialize(set: Set<unknown>): Promise<SerializedSet>
    {
        const values: unknown[] = [];

        for (const value of set.values())
        {
            values.push(await this.serializeOther(value));
        }

        return { serialized: true, name: 'Set', values: values };
    }

    async deserialize(object: SerializedSet): Promise<Set<unknown>>
    {
        const values = await Promise.all(object.values.map(async (value: unknown) => this.deserializeOther(value)));

        return new Set([...values]);
    }
}
