
import Parser from './parser/Parser.js';

import ReflectionClass from './models/ReflectionClass.js';
import ReflectionExpression from './models/ReflectionExpression.js';
import ReflectionField from './models/ReflectionField.js';
import ReflectionFunction from './models/ReflectionFunction.js';
import ReflectionModule from './models/ReflectionModule.js';
import ReflectionScope from './models/ReflectionScope.js';

const parser = new Parser();

export default class Reflector
{
    parse(code: string): ReflectionModule
    {
        return parser.parse(code);
    }

    parseClass(code: string): ReflectionClass
    {
        return parser.parseClass(code);
    }

    parseFunction(code: string): ReflectionFunction
    {
        return parser.parseFunction(code);
    }

    parseField(code: string): ReflectionField
    {
        return parser.parseField(code);
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

                members.push(new ReflectionField(key, expression));
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
        const fields = new Map<string, ReflectionField>();
        const functions = new Map<string, ReflectionFunction>();
        const getters = new Map<string, ReflectionFunction>();
        const setters = new Map<string, ReflectionFunction>();
        
        parentModel.fields.forEach(field => fields.set(field.name, field));
        parentModel.functions.forEach(funktion => functions.set(funktion.name, funktion));
        parentModel.getters.forEach(getter => getters.set(getter.name, getter));
        parentModel.setters.forEach(setter => setters.set(setter.name, setter));

        model.fields.forEach(field => fields.set(field.name, field));
        model.functions.forEach(funktion => functions.set(funktion.name, funktion));
        model.getters.forEach(getter => getters.set(getter.name, getter));
        model.setters.forEach(setter => setters.set(setter.name, setter));

        const members = [...fields.values(), ...functions.values(), ...getters.values(), ...setters.values()];

        return new ReflectionClass(model.name, parentModel.name, new ReflectionScope(members));
    }
}
