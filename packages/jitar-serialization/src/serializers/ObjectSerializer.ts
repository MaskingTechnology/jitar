
import ValueSerializer from '../ValueSerializer.js';
import SerializableObject from '../types/serialized/SerializableObject.js';
import SerializedObject from '../types/serialized/SerializedObject.js';

export default class ObjectSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return value instanceof Object
            && value.constructor === Object;
    }

    canDeserialize(value: unknown): boolean
    {
        return value instanceof Object
            && value.constructor === Object;
    }
    
    async serialize(object: SerializableObject): Promise<SerializedObject>
    {
        const result: SerializedObject = {};

        for (const key in object)
        {
            const value = object[key];

            result[key] = await this.serializeOther(value);
        }

        return result;
    }

    async deserialize(object: SerializedObject): Promise<SerializableObject>
    {
        const result: SerializableObject = {};

        for (const key in object)
        {
            const value = object[key];

            result[key] = await this.deserializeOther(value);
        }

        return result;
    }
}
