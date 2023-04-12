
import ValueSerializer from '../ValueSerializer.js';

export default class PrimitiveSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return (value instanceof Object) === false;
    }

    canDeserialize(value: unknown): boolean
    {
        return (value instanceof Object) === false;
    }
    
    async serialize(primitive: unknown): Promise<unknown>
    {
        return primitive;
    }

    async deserialize(primitive: unknown): Promise<unknown>
    {
        return primitive;
    }
}
