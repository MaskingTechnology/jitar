
import { ReflectionClass, ReflectionField, Reflector } from 'jitar-reflection';

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
    #classLoader: ClassLoader;

    constructor(classLoader: ClassLoader)
    {
        super();

        this.#classLoader = classLoader;
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
            && typeof object.name === 'string'
            && object.args instanceof Array
            && object.fields instanceof Object
            && object.fields.constructor === Object;
    }

    async serialize(object: object): Promise<SerializedClass>
    {
        const clazz = reflector.getClass(object);
        const model = reflector.fromClass(clazz, true);
        const parameterNames = this.#extractParameterNames(model);

        const name = clazz.name;
        const source = (clazz as Loadable).source;
        const args: unknown[] = await this.#extractArguments(model, parameterNames, object);
        const fields: FlexObject = await this.#extractFields(model, parameterNames, object);

        return { serialized: true, name: name, source: source, args: args, fields: fields };
    }

    #extractParameterNames(model: ReflectionClass): string[]
    {
        const constructor = model.getFunction('constructor');
        const parameters = (constructor?.parameters ?? []) as ReflectionField[];

        return parameters.map(parameter => parameter.name);
    }

    async #extractArguments(model: ReflectionClass, includeNames: string[], object: object): Promise<unknown[]>
    {
        const args: unknown[] = [];

        for (const name of includeNames)
        {
            // Constructor parameters that can't be read make it impossible to fully reconstruct the object.

            const objectValue = model.canRead(name)
                ? await this.serializeOther((object as FlexObject)[name])
                : undefined;
            
            args.push(objectValue);
        }

        return args;
    }

    async #extractFields(model: ReflectionClass, excludeNames: string[], object: object): Promise<FlexObject>
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

        if ((clazz instanceof Function) === false)
        {
            throw new InvalidClass(object.name);
        }

        const args = await Promise.all(object.args.map(async (value) => await this.deserializeOther(value)));

        const instance = reflector.createInstance(clazz as Function, args) as SerializableObject;

        for (const name in object.fields)
        {
            const fieldValue = object.fields[name];

            instance[name] = await this.deserializeOther(fieldValue);
        }

        return instance;
    }

    async #getClass(clazz: Loadable): Promise<unknown>
    {
        if (clazz.source === undefined)
        {
            return (globalThis as FlexObject)[clazz.name];
        }

        return this.#classLoader.loadClass(clazz);
    }
}
