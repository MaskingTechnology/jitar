
import ValueSerializer from './ValueSerializer.js';
import NoDeserializerFound from './errors/NoDeserializerFound.js';
import NoSerializerFound from './errors/NoSerializerFound.js';

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
            throw new NoSerializerFound(typeof value);
        }

        return serializer.serialize(value);
    }

    async deserialize(value: unknown): Promise<unknown>
    {
        const serializer = this.#serializers.find(serializer => serializer.canDeserialize(value));

        if (serializer === undefined)
        {
            throw new NoDeserializerFound(typeof value);
        }

        return serializer.deserialize(value);
    }
}
