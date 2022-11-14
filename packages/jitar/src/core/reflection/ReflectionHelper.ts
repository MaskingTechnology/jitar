
import ReflectionField from './models/ReflectionField.js';
import ReflectionParameter from './models/ReflectionParameter.js';
import ParameterParser from './ParameterParser.js';

const CONSTRUCTOR_NAME = 'constructor';
const FUNCTION_NAME = 'function';

export default class ReflectionHelper
{
    static createInstance(clazz: Function, args: unknown[] = []): object
    {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (clazz as any)(...args);
    }

    static isClassObject(object: object): boolean
    {
        return object.constructor.toString().startsWith('class');
    }

    static getObjectClass(object: object): Function
    {
        return object.constructor;
    }

    static getParentClass(clazz: Function): Function
    {
        return Object.getPrototypeOf(clazz);
    }

    static getFields(clazz: Function): ReflectionField[]
    {
        const object = this.createInstance(clazz);
        const publicFields = this.#getPublicFields(object);
        const propertyFields = this.#getPropertyFields(clazz);

        return [...publicFields, ...propertyFields];
    }

    static getObjectFields(object: object): ReflectionField[]
    {
        const clazz = this.getObjectClass(object);
        const publicFields = this.#getPublicFields(object);
        const propertyFields = this.#getPropertyFields(clazz);

        return [...publicFields, ...propertyFields];
    }

    static #getPublicFields(object: object): ReflectionField[]
    {
        const fieldNames = Object.getOwnPropertyNames(object);

        return fieldNames.map(fieldName => new ReflectionField(fieldName, true, true));
    }

    static #getPropertyFields(clazz: Function): ReflectionField[]
    {
        const methods = Object.getOwnPropertyDescriptors(clazz.prototype);

        const fields = [];

        for (const name in methods)
        {
            const description = methods[name];

            const hasGetter = description.get !== undefined;
            const hasSetter = description.set !== undefined;

            if (hasGetter === false && hasSetter === false)
            {
                // This is not a property.

                continue;
            }

            fields.push(new ReflectionField(name, hasGetter, hasSetter));
        }

        const parentClazz = this.getParentClass(clazz);

        if (parentClazz.name !== '')
        {
            const parentFields = this.#getPropertyFields(parentClazz);

            return [...fields, ...parentFields];
        }

        return fields;
    }

    static getConstructorParameters(clazz: Function): ReflectionParameter[]
    {
        const code = clazz.toString();
        const hasConstructor = code.includes(CONSTRUCTOR_NAME);

        if (hasConstructor === false)
        {
            const parentClazz = this.getParentClass(clazz);

            if (parentClazz.name === '')
            {
                return [];
            }

            return this.getConstructorParameters(parentClazz);
        }

        return ParameterParser.parse(code, CONSTRUCTOR_NAME);
    }

    static getFunctionParameters(funktion: Function): ReflectionParameter[]
    {
        const code = funktion.toString();

        return ParameterParser.parse(code, FUNCTION_NAME);
    }
}
