
import { ReflectionClass, ReflectionField, Reflector } from '@jitar/reflection';

import ValueSerializer from '../ValueSerializer';
import ClassNotFound from '../errors/ClassNotFound';
import InvalidClass from '../errors/InvalidClass';
import ClassResolver from '../interfaces/ClassResolver';
import FlexObject from '../types/serialized/SerializableObject';
import SerializableObject from '../types/serialized/SerializableObject';
import SerializedClass from '../types/serialized/SerializedClass';
import Resolvable from '../types/Resolvable';

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

        const name = 'class';
        const key = this.#classResolver.resolveKey(clazz);
        const args: FlexObject = await this.#serializeConstructor(model, parameterNames, object);
        const fields: FlexObject = await this.#serializeFields(model, parameterNames, object);

        return { serialized: true, key, name, args, fields };
    }

    #extractConstructorParameters(model: ReflectionClass): string[]
    {
        const constructor = model.getFunction('constructor');
        const parameters = (constructor?.parameters ?? []) as ReflectionField[];

        return parameters.map(parameter => parameter.name);
    }

    async #serializeConstructor(model: ReflectionClass, includeNames: string[], object: object): Promise<FlexObject>
    {
        const args: FlexObject = {};

        for (const name of includeNames)
        {
            // Constructor parameters that can't be read make it impossible to fully reconstruct the object.

            const objectValue = model.canRead(name)
                ? await this.serializeOther((object as FlexObject)[name])
                : undefined;

            args[name] = objectValue;
        }

        return args;
    }

    async #serializeFields(model: ReflectionClass, excludeNames: string[], object: object): Promise<FlexObject>
    {
        const fields: FlexObject = {};

        for (const property of model.writable)
        {
            const name = property.name;

            if (excludeNames.includes(name) || model.canRead(name) === false)
            {
                // Fields set via the constructor or that can't be read are ignored.

                continue;
            }

            fields[name] = await this.serializeOther((object as FlexObject)[name]);
        }

        return fields;
    }

    async deserialize(object: SerializedClass): Promise<SerializableObject>
    {
        const clazz = await this.#getClass(object);

        if (clazz === undefined)
        {
            throw new ClassNotFound(object.name);
        }
        else if ((clazz instanceof Function) === false)
        {
            throw new InvalidClass(object.name);
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

    async #deserializeConstructor(clazz: Function, args: FlexObject): Promise<unknown[]>
    {
        const model = reflector.fromClass(clazz, true);
        const constructor = model.getFunction('constructor');
        const parameters = (constructor?.parameters ?? []) as ReflectionField[];

        const values = parameters.map(parameter =>
        {
            const value = args[parameter.name];

            return this.deserializeOther(value);
        });

        return Promise.all(values);
    }

    async #getClass(resolvable: Resolvable): Promise<unknown>
    {
        if (resolvable.key === undefined)
        {
            return (globalThis as FlexObject)[resolvable.key];
        }

        return this.#classResolver.resolveClass(resolvable.key);
    }
}
