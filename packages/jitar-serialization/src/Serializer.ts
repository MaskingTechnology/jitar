
import ValueSerializer from './ValueSerializer.js';

export default class Serializer
{
    #serializers: ValueSerializer[] = [];

    addSerializer(serializer: ValueSerializer): void
    {
        serializer.parent = this;

        // Serializers will be added at the beginning of the array,
        // so that the most specific serializer is used first.

        this.#serializers.unshift(serializer);
    }

    async serialize(value: unknown): Promise<unknown>
    {
        const serializer = this.#serializers.find(serializer => serializer.canSerialize(value));

        if (serializer === undefined)
        {
            throw new Error(`No serializer found for value of type ${typeof value}`);
        }

        return serializer.serialize(value);
    }

    async deserialize(value: unknown): Promise<unknown>
    {
        const serializer = this.#serializers.find(serializer => serializer.canDeserialize(value));

        if (serializer === undefined)
        {
            throw new Error(`No deserializer found for value of type ${typeof value}`);
        }

        return serializer.deserialize(value);
    }
}
