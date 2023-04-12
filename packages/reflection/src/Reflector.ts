
import Parser from './parser/Parser.js';

import ReflectionClass from './models/ReflectionClass.js';
import ReflectionDeclaration from './models/ReflectionDeclaration.js';
import ReflectionExpression from './models/ReflectionExpression.js';
import ReflectionExport from './models/ReflectionExport.js';
import ReflectionFunction from './models/ReflectionFunction.js';
import ReflectionGetter from './models/ReflectionGetter.js';
import ReflectionImport from './models/ReflectionImport.js';
import ReflectionMember from './models/ReflectionMember.js';
import ReflectionModule from './models/ReflectionModule.js';
import ReflectionScope from './models/ReflectionScope.js';
import ReflectionSetter from './models/ReflectionSetter.js';
import ReflectionValue from './models/ReflectionValue.js';

import ClassMerger from './utils/ClassMerger.js';

export default class Reflector
{
    #parser: Parser;
    #merger: ClassMerger;

    constructor(parser = new Parser(), merger = new ClassMerger())
    {
        this.#parser = parser;
        this.#merger = merger;
    }

    parse(code: string): ReflectionModule
    {
        return this.#parser.parse(code);
    }

    parseClass(code: string): ReflectionClass
    {
        return this.#parser.parseClass(code);
    }

    parseFunction(code: string): ReflectionFunction
    {
        return this.#parser.parseFunction(code);
    }

    parseDeclaration(code: string): ReflectionDeclaration
    {
        return this.#parser.parseDeclaration(code);
    }

    parseImport(code: string): ReflectionImport
    {
        return this.#parser.parseImport(code);
    }

    parseExport(code: string): ReflectionExport
    {
        return this.#parser.parseExport(code);
    }

    fromModule(module: object, inherit = false): ReflectionModule
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
                const expression = new ReflectionExpression(code);

                members.push(new ReflectionDeclaration(key, expression));
            }
        }
        
        return new ReflectionModule(new ReflectionScope(members));
    }

    fromClass(clazz: Function, inherit = false): ReflectionClass
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

    fromObject(object: object, inherit = true): ReflectionClass
    {
        const clazz = this.getClass(object);

        return this.fromClass(clazz, inherit);
    }

    fromFunction(funktion: Function): ReflectionFunction
    {
        const code = funktion.toString();

        return this.parseFunction(code);
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

    #reflectStatic(clazz: Function): ReflectionClass
    {
        const code = clazz.toString();

        return this.parseClass(code);
    }

    #reflectDynamic(clazz: Function): ReflectionClass
    {
        const object = this.createInstance(clazz);
        const members = this.#getMembers(clazz, object);
        const scope = new ReflectionScope(members);

        return new ReflectionClass(clazz.name, undefined, scope);
    }

    #getMembers(clazz: Function, object: Object): ReflectionMember[]
    {
        const declarations = this.#getDeclarations(object);
        const functions = this.#getFunctions(clazz);

        return [...declarations, ...functions];
    }

    #getDeclarations(object: Object): ReflectionDeclaration[]
    {
        const fieldNames = Object.getOwnPropertyNames(object);
        const values = object as Record<string, unknown>;

        const models: ReflectionDeclaration[] = [];

        for (const fieldName of fieldNames)
        {
            const content = values[fieldName];
            const value = content !== undefined ? new ReflectionValue(String(content)) : undefined;
            const model = new ReflectionDeclaration(fieldName, value);

            models.push(model);
        }

        return models;
    }

    #getFunctions(clazz: Function): ReflectionFunction[]
    {
        const functionDescriptions = Object.getOwnPropertyDescriptors(clazz.prototype);

        const models: ReflectionFunction[] = [];

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
                models.push(new ReflectionGetter(model.name, model.parameters, model.body, model.isStatic, model.isAsync, model.isPrivate));
            }
            else if (description.set !== undefined)
            {
                models.push(new ReflectionSetter(model.name, model.parameters, model.body, model.isStatic, model.isAsync, model.isPrivate));
            }
            else
            {
                models.push(model);
            }
        }

        return models;
    }
}
