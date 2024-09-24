
import ESClass from '../models/ESClass.js';
import ESDeclaration from '../models/ESDeclaration.js';
import ESExpression from '../models/ESExpression.js';
import ESFunction from '../models/ESFunction.js';
import ESGetter from '../models/ESGetter.js';
import ESMember from '../models/ESMember.js';
import ESModule from '../models/ESModule.js';
import ESScope from '../models/ESScope.js';
import ESSetter from '../models/ESSetter.js';
import ESValue from '../models/ESValue.js';

import Parser from '../static/Parser.js';

import ClassMerger from './ClassMerger.js';

export default class Reflector
{
    #parser: Parser;
    #merger: ClassMerger;

    constructor(parser = new Parser(), merger = new ClassMerger())
    {
        this.#parser = parser;
        this.#merger = merger;
    }

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

                members.push(new ESDeclaration(key, expression));
            }
        }
        
        return new ESModule(new ESScope(members));
    }

    fromClass(clazz: Function, inherit = false): ESClass
    {
        const model = this.isClass(clazz)
            ? this.#reflectStatic(clazz)
            : this.#reflectDynamic(clazz);

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

    #reflectStatic(clazz: Function): ESClass
    {
        const code = clazz.toString();

        return this.#parser.parseClass(code);
    }

    #reflectDynamic(clazz: Function): ESClass
    {
        const object = this.createInstance(clazz);
        const members = this.#getMembers(clazz, object);
        const scope = new ESScope(members);

        return new ESClass(clazz.name, undefined, scope);
    }

    #getMembers(clazz: Function, object: Object): ESMember[]
    {
        const declarations = this.#getDeclarations(object);
        const functions = this.#getFunctions(clazz);

        return [...declarations, ...functions];
    }

    #getDeclarations(object: Object): ESDeclaration[]
    {
        const fieldNames = Object.getOwnPropertyNames(object);
        const values = object as Record<string, unknown>;

        const models: ESDeclaration[] = [];

        for (const fieldName of fieldNames)
        {
            const content = values[fieldName];
            const value = content !== undefined ? new ESValue(String(content)) : undefined;
            const model = new ESDeclaration(fieldName, value);

            models.push(model);
        }

        return models;
    }

    #getFunctions(clazz: Function): ESFunction[]
    {
        const functionDescriptions = Object.getOwnPropertyDescriptors(clazz.prototype);

        const models: ESFunction[] = [];

        for (const functionName in functionDescriptions)
        {
            const description = functionDescriptions[functionName];
            const funktion = description.value;

            if (funktion instanceof Function === false)
            {
                continue;
            }

            const model = this.fromFunction(funktion);

            if (description.get !== undefined)
            {
                models.push(new ESGetter(model.name, model.parameters, model.body, model.isStatic, model.isAsync, model.isPrivate));
            }
            else if (description.set !== undefined)
            {
                models.push(new ESSetter(model.name, model.parameters, model.body, model.isStatic, model.isAsync, model.isPrivate));
            }
            else
            {
                models.push(model);
            }
        }

        return models;
    }
}
