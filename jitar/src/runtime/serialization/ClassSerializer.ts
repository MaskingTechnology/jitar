
import ReflectionHelper from '../../core/reflection/ReflectionHelper.js';
import Component from '../../core/types/Component.js';
import FlexObject from '../../core/types/FlexObject.js';
import Module from '../../core/types/Module.js';

import ModuleLoader from '../utils/ModuleLoader.js';
import ClassNotFound from './errors/ClassNotFound.js';
import InvalidClass from './errors/InvalidClass.js';

import Serializer from './interfaces/Serializer.js';
import SerializableObject from './types/SerializableObject.js';
import SerializedClass from './types/SerializedClass.js';
import ValueSerializer from './ValueSerializer.js';

class ClassSerializer implements Serializer
{
    serialize(object: SerializableObject): SerializedClass
    {
        const clazz = ReflectionHelper.getObjectClass(object);
        const classFields = ReflectionHelper.getObjectFields(object);
        const constructParameters = ReflectionHelper.getConstructorParameters(clazz);

        const name = clazz.name;
        const source = (clazz as Component).source || null;
        const args: unknown[] = [];
        const fields: FlexObject = {};

        for (const parameter of constructParameters)
        {
            const objectValue = object[parameter.name];
            const classFieldIndex = classFields.findIndex(field => field.name === parameter.name);

            if (classFieldIndex !== -1)
            {
                classFields.splice(classFieldIndex, 1);
            }

            args.push(ValueSerializer.serialize(objectValue));
        }

        for (const field of classFields)
        {
            if (field.canGetAndSet === false)
            {
                // Fields that can't be accessed or updated are ignored.
                // This is to prevent the serialization of fields that are only used for internal purposes.

                continue;
            }

            const objectValue = object[field.name];

            fields[field.name] = ValueSerializer.serialize(objectValue);
        }

        return { serialized: true, name: name, source: source, args: args, fields: fields };
    }

    async deserialize(object: SerializedClass): Promise<SerializableObject>
    {
        const clazz = await this.#loadClass(object.source, object.name);

        if (clazz === undefined)
        {
            throw new ClassNotFound(object.name);
        }

        if ((clazz instanceof Function) === false)
        {
            throw new InvalidClass(object.name);
        }

        const args = await Promise.all(object.args.map(async (value) => await ValueSerializer.deserialize(value)));

        const instance = ReflectionHelper.createInstance(clazz as Function, args) as SerializableObject;

        for (const name in object.fields)
        {
            const fieldValue = object.fields[name];

            instance[name] = await ValueSerializer.deserialize(fieldValue);
        }

        return instance;
    }

    async #loadClass(source: string | null, name: string): Promise<unknown>
    {
        if (source === null)
        {
            const system: unknown = typeof window !== 'undefined' ? window : global;

            return (system as Module)[name];
        }

        const module = await ModuleLoader.load(source);

        return module[name] ?? module.default;
    }
}

const instance = new ClassSerializer();

export default instance;
