
import Serializer from './interfaces/Serializer.js';

import SerializableObject from './types/SerializableObject.js';
import SerializedObject from './types/SerializedObject.js';

import ValueSerializer from './ValueSerializer.js';

class ObjectSerializer implements Serializer
{
    serialize(object: SerializableObject): SerializedObject
    {
        const result: SerializedObject = {};

        for (const key in object)
        {
            const value = object[key];

            result[key] = ValueSerializer.serialize(value);
        }

        return result;
    }

    async deserialize(object: SerializedObject): Promise<SerializableObject>
    {
        const result: SerializableObject = {};

        for (const key in object)
        {
            const value = object[key];

            result[key] = await ValueSerializer.deserialize(value);
        }

        return result;
    }
}

const instance = new ObjectSerializer();

export default instance;
