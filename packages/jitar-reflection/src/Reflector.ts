
import Parser from './parser/Parser.js';

import ReflectionClass from './models/ReflectionClass.js';
import ReflectionExpression from './models/ReflectionExpression.js';
import ReflectionExport from './models/ReflectionExport.js';
import ReflectionField from './models/ReflectionField.js';
import ReflectionFunction from './models/ReflectionFunction.js';
import ReflectionImport from './models/ReflectionImport.js';
import ReflectionModule from './models/ReflectionModule.js';
import ReflectionScope from './models/ReflectionScope.js';
import ReflectionDeclaration from './models/ReflectionDeclaration.js';

export default class Reflector
{
    #parser: Parser;

    constructor(parser = new Parser())
    {
        this.#parser = parser;
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
        const code = clazz.toString();
        const model = this.parseClass(code);

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

        return this.#mergeClassModels(model, parentModel);
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

    isClassObject(object: object): boolean
    {
        return object.constructor.toString().startsWith('class');
    }

    getClass(object: object): Function
    {
        return object.constructor;
    }

    getParentClass(clazz: Function): Function
    {
        return Object.getPrototypeOf(clazz);
    }

    #mergeClassModels(model: ReflectionClass, parentModel: ReflectionClass): ReflectionClass
    {
        const declarations = new Map<string, ReflectionDeclaration>();
        const functions = new Map<string, ReflectionFunction>();
        const getters = new Map<string, ReflectionFunction>();
        const setters = new Map<string, ReflectionFunction>();
        
        parentModel.declarations.forEach(declaration => declarations.set(declaration.name, declaration));
        parentModel.functions.forEach(funktion => functions.set(funktion.name, funktion));
        parentModel.getters.forEach(getter => getters.set(getter.name, getter));
        parentModel.setters.forEach(setter => setters.set(setter.name, setter));

        model.declarations.forEach(declaration => declarations.set(declaration.name, declaration));
        model.functions.forEach(funktion => functions.set(funktion.name, funktion));
        model.getters.forEach(getter => getters.set(getter.name, getter));
        model.setters.forEach(setter => setters.set(setter.name, setter));

        const members = [...declarations.values(), ...functions.values(), ...getters.values(), ...setters.values()];

        return new ReflectionClass(model.name, parentModel.name, new ReflectionScope(members));
    }
}
