
import { ESClass, ESClassMember, ESVariable, ESExpression, ESFunction, ESField, ESMethod, ESGetter, ESModule, ESSetter, ESConstructor } from '../model';
import { Parser } from '../static';

import ClassMerger from './ClassMerger';

export default class Reflector
{
    readonly #parser = new Parser();
    readonly #merger = new ClassMerger();

    fromModule(module: object, inherit = false): ESModule
    {
        const entries = Object.entries(module);
        const members = [];

        for (const [key, member] of entries)
        {
            if (typeof member.toString !== 'function')
            {
                continue;
            }

            const code = member.toString();

            if (code.startsWith('class'))
            {
                members.push(this.fromClass(member, inherit));
            }
            else if (code.startsWith('function'))
            {
                members.push(this.fromFunction(member));
            }
            else
            {
                const expression = new ESExpression(code);

                members.push(new ESVariable('var', key, expression));
            }
        }

        return new ESModule(members);
    }

    fromClass(clazz: Function, inherit = false): ESClass
    {
        const model = this.isClass(clazz)
            ? this.#reflectClassStatic(clazz)
            : this.#reflectClassDynamic(clazz);

        if (inherit === false)
        {
            return model;
        }

        const parentClazz = this.getParentClass(clazz);

        if (parentClazz.name === '')
        {
            return model;
        }

        const parentModel = this.fromClass(parentClazz, true);

        return this.#merger.merge(model, parentModel);
    }

    fromObject(object: object, inherit = true): ESClass
    {
        const clazz = this.getClass(object);

        return this.fromClass(clazz, inherit);
    }

    fromFunction(funktion: Function): ESFunction
    {
        const code = funktion.toString();

        return this.#parser.parseFunction(code);
    }

    createInstance(clazz: Function, args: unknown[] = []): object
    {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (clazz as any)(...args);
    }

    getClass(object: object): Function
    {
        return object.constructor;
    }

    getParentClass(clazz: Function): Function
    {
        return Object.getPrototypeOf(clazz);
    }

    isClassObject(object: object): boolean
    {
        return this.isClass(object.constructor);
    }

    isFunctionObject(object: object): boolean
    {
        return this.isFunction(object.constructor);
    }

    isClass(clazz: Function): boolean
    {
        return clazz.toString().startsWith('class');
    }

    isFunction(clazz: Function): boolean
    {
        return clazz.toString().startsWith('function')
            || clazz.toString().startsWith('async function');
    }

    #reflectClassStatic(clazz: Function): ESClass
    {
        const code = clazz.toString();

        return this.#parser.parseClass(code);
    }

    #reflectClassDynamic(clazz: Function): ESClass
    {
        const instance = this.createInstance(clazz);
        const members = this.#getClassMembers(clazz, instance);

        return new ESClass(clazz.name, undefined, members);
    }

    #getClassMembers(clazz: Function, instance: object): ESClassMember[]
    {
        const fields = this.#getClassFields(instance);
        const methods = this.#getClassMethods(clazz);

        return [...fields, ...methods];
    }

    #getClassFields(instance: object): ESField[]
    {
        const fieldNames = Object.getOwnPropertyNames(instance);
        const values = instance as Record<string, unknown>;

        const models = [];

        for (const fieldName of fieldNames)
        {
            const content = values[fieldName];
            const initializer = content !== undefined ? new ESExpression(String(content)) : undefined;
            const model = new ESField(fieldName, 'public', 'instance', initializer);

            models.push(model);
        }

        return models;
    }

    #getClassMethods(clazz: Function): (ESConstructor | ESGetter | ESSetter | ESMethod )[]
    {
        const functionDescriptions = Object.getOwnPropertyDescriptors(clazz.prototype);

        const models = [];

        for (const functionName in functionDescriptions)
        {
            const description = functionDescriptions[functionName];
            const method = description.value;

            if (method instanceof Function === false)
            {
                continue;
            }

            const model = this.fromFunction(method);

            if (model.identifier === 'constructor')
            {
                models.push(new ESConstructor(model.parameters, model.body));
            }
            else if (description.get !== undefined)
            {
                models.push(new ESGetter(model.identifier!, 'public', 'instance', model.body));
            }
            else if (description.set !== undefined)
            {
                models.push(new ESSetter(model.identifier!, 'public', 'instance', model.parameters[0], model.body));
            }
            else
            {
                models.push(new ESMethod(model.identifier!, 'public', 'instance', model.parameters, model.body, model.isAsync));
            }
        }

        return models;
    }
}
