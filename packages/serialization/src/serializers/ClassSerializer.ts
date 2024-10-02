
import { ESClass, ESField, Reflector } from '@jitar/analysis';

import ValueSerializer from '../ValueSerializer.js';
import ClassNotFound from '../errors/ClassNotFound.js';
import InvalidClass from '../errors/InvalidClass.js';
import ClassLoader from '../interfaces/ClassLoader.js';
import Loadable from '../types/Loadable.js';
import FlexObject from '../types/serialized/SerializableObject.js';
import SerializableObject from '../types/serialized/SerializableObject.js';
import SerializedClass from '../types/serialized/SerializedClass.js';

const reflector = new Reflector();

export default class ClassSerializer extends ValueSerializer
{
    #classResolver: ClassResolver;

    constructor(classResolver: ClassResolver)
    {
        super();

        this.#classResolver = classResolver;
    }

    canSerialize(value: unknown): boolean
    {
        return value instanceof Object
            && reflector.isClassObject(value);
    }

    canDeserialize(value: unknown): boolean
    {
        const object = value as SerializedClass;

        return object instanceof Object
            && object.serialized === true
            && object.name === 'class'
            && typeof object.key === 'string'
            && object.args instanceof Object
            && object.args.constructor === Object
            && object.fields instanceof Object
            && object.fields.constructor === Object;
    }

    async serialize(object: object): Promise<SerializedClass>
    {
        const clazz = reflector.getClass(object);
        const model = reflector.fromClass(clazz, true);
        const parameterNames = this.#extractConstructorParameters(model);

        const name = clazz.name;
        const source = (clazz as Loadable).source;
        const args: FlexObject = await this.#serializeConstructor(model, parameterNames, object);
        const fields: FlexObject = await this.#serializeFields(model, parameterNames, object);

        return { serialized: true, key, name, args, fields };
    }

    #extractConstructorParameters(model: ESClass): string[]
    {
        const constructor = model.getFunction('constructor');
        const parameters = (constructor?.parameters ?? []) as ESField[];

        return parameters.map(parameter => parameter.name);
    }

    async #serializeConstructor(model: ReflectionClass, includeNames: string[], object: object): Promise<FlexObject>
    {
        const args: SerializableObject = {};

        for (const [index, name] of includeNames.entries())
        {
            // Constructor parameters that can't be read make it impossible to fully reconstruct the object.

            const objectValue = model.canRead(name)
                ? await this.serializeOther((object as FlexObject)[name])
                : undefined;

            const key = index.toString();

            args[key] = value;
        }

        return args;
    }

    async #serializeFields(model: ReflectionClass, excludeNames: string[], object: object): Promise<FlexObject>
    {
        const fields: SerializableObject = {};

        for (const property of model.writable)
        {
            const name = property.name;

            if (excludeNames.includes(name) || model.canRead(name) === false)
            {
                // Fields set via the constructor or that can't be read are ignored.

                continue;
            }

            fields[name] = await this.serializeOther((object as SerializableObject)[name]);
        }

        return fields;
    }

    async deserialize(object: SerializedClass): Promise<SerializableObject>
    {
        const clazz = await this.#getClass(object);

        if (clazz === undefined)
        {
            throw new ClassNotFound(object.key);
        }
        else if ((clazz instanceof Function) === false)
        {
            throw new InvalidClass(object.key);
        }

        const args = await this.#deserializeConstructor(clazz, object.args);

        const instance = reflector.createInstance(clazz, args) as SerializableObject;

        for (const name in object.fields)
        {
            const fieldValue = object.fields[name];

            instance[name] = await this.deserializeOther(fieldValue);
        }

        return instance;
    }

    async #deserializeConstructor(clazz: Function, args: SerializableObject): Promise<unknown[]>
    {
        const model = reflector.fromClass(clazz, true);
        const constructor = model.getFunction('constructor');
        const parameters = (constructor?.parameters ?? []) as ESField[];

        const values = parameters.map((_, index) =>
        {
            const key = index.toString();
            const value = args[key];

            return this.deserializeOther(value);
        });

        return Promise.all(values);
    }

    async #getClass(resolvable: Resolvable): Promise<unknown>
    {
        if (loadable.source === undefined)
        {
            return (globalThis as FlexObject)[loadable.name];
        }

        return this.#classLoader.loadClass(loadable);
    }
}
