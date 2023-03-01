
import Serializer from './Serializer.js';

export default abstract class ValueSerializer
{
    #parent?: Serializer;

    set parent(parent: Serializer) { this.#parent = parent; }

    abstract canSerialize(value: unknown): boolean;

    abstract canDeserialize(value: unknown): boolean;

    abstract serialize(value: unknown): Promise<unknown>;

    abstract deserialize(value: unknown): Promise<unknown>;

    serializeOther(value: unknown): Promise<unknown>
    {
        if (this.#parent === undefined)
        {
            throw new Error('Parent not set');
        }

        return this.#parent.serialize(value);
    }

    deserializeOther(value: unknown): Promise<unknown>
    {
        if (this.#parent === undefined)
        {
            throw new Error('Parent not set');
        }

        return this.#parent.deserialize(value);
    }
}
