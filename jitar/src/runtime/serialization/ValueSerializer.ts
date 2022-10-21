
import ReflectionHelper from '../../core/reflection/ReflectionHelper.js';

import ArraySerializer from './ArraySerializer.js';
import ClassSerializer from './ClassSerializer.js';
import Serializer from './interfaces/Serializer.js';
import MapSerializer from './MapSerializer.js';
import ObjectSerializer from './ObjectSerializer.js';
import SetSerializer from './SetSerializer.js';

import SerializableObject from './types/SerializableObject.js';
import Serialized from './types/Serialized.js';
import SerializedClass from './types/SerializedClass.js';
import SerializedMap from './types/SerializedMap.js';
import SerializedObject from './types/SerializedObject.js';
import SerializedSet from './types/SerializedSet.js';

class ValueSerializer implements Serializer
{
    serialize(value: unknown): unknown
    {
        if (value instanceof Array)
        {
            return ArraySerializer.serialize(value);
        }
        else if (value instanceof Map)
        {
            return MapSerializer.serialize(value);
        }
        else if (value instanceof Set)
        {
            return SetSerializer.serialize(value);
        }
        else if (value instanceof Error)
        {
            // The error class is like Array, Map and Set in that it's a native class.
            // Native classes cannot be defined as a class object by the reflection helper.
            // Unlike Array, Map and Set, the error class can be serialzed by the class serializer.

            // The type casting below isn't pretty, but works for now...
            return ClassSerializer.serialize(value as unknown as SerializableObject);
        }
        else if (value instanceof Object)
        {
            return ReflectionHelper.isClassObject(value)
                ? ClassSerializer.serialize(value as SerializableObject)
                : ObjectSerializer.serialize(value as SerializableObject);
        }

        return value;
    }

    async deserialize(value: unknown): Promise<unknown>
    {
        if ((value instanceof Object) === false)
        {
            return value;
        }

        if (value instanceof Array)
        {
            return await ArraySerializer.deserialize(value);
        }

        if ((value as Serialized).serialized !== true)
        {
            return await ObjectSerializer.deserialize(value as SerializedObject);
        }

        switch ((value as Serialized).name)
        {
            case 'Map': return await MapSerializer.deserialize(value as SerializedMap);
            case 'Set': return await SetSerializer.deserialize(value as SerializedSet);
            default: return await ClassSerializer.deserialize(value as SerializedClass);
        }
    }
}

const instance = new ValueSerializer();

export default instance;
