
import ReflectionMember from './ReflectionMember.js';
import ReflectionGetter from './ReflectionGetter.js';
import ReflectionSetter from './ReflectionSetter.js';
import ReflectionFunction from './ReflectionFunction.js';
import ReflectionClass from './ReflectionClass.js';
import ReflectionImport from './ReflectionImport.js';
import ReflectionExport from './ReflectionExport.js';
import ReflectionGenerator from './ReflectionGenerator.js';
import ReflectionDeclaration from './ReflectionDeclaration.js';

// Required to work after minification.
const IMPORT_NAME = ReflectionImport.name;
const EXPORT_NAME = ReflectionExport.name;
const DECLARATION_NAME = ReflectionDeclaration.name;
const FUNCTION_NAME = ReflectionFunction.name;
const GETTER_NAME = ReflectionGetter.name;
const SETTER_NAME = ReflectionSetter.name;
const GENERATOR_NAME = ReflectionGenerator.name;
const CLASS_NAME = ReflectionClass.name;

export default class ReflectionScope
{
    #members: ReflectionMember[];

    constructor(members: ReflectionMember[])
    {
        this.#members = members;
    }

    // The constructor name is used to determine the type of the member.
    // This makes sure that the member is of the exact type and not a subclass.

    get members(): ReflectionMember[] { return this.#members; }

    get imports(): ReflectionImport[] { return this.#members.filter(member => member.constructor.name === IMPORT_NAME) as ReflectionImport[]; }

    get exports(): ReflectionExport[] { return this.#members.filter(member => member.constructor.name === EXPORT_NAME) as ReflectionExport[]; }

    get declarations(): ReflectionDeclaration[] { return this.#members.filter(member => member.constructor.name === DECLARATION_NAME) as ReflectionDeclaration[]; }

    get functions(): ReflectionFunction[] { return this.#members.filter(member => member.constructor.name === FUNCTION_NAME) as ReflectionFunction[]; }

    get getters(): ReflectionGetter[] { return this.#members.filter(member => member.constructor.name === GETTER_NAME) as ReflectionGetter[]; }

    get setters(): ReflectionSetter[] { return this.#members.filter(member => member.constructor.name === SETTER_NAME) as ReflectionSetter[]; }

    get generators(): ReflectionGenerator[] { return this.#members.filter(member => member.constructor.name === GENERATOR_NAME) as ReflectionGenerator[]; }

    get classes(): ReflectionClass[] { return this.#members.filter(member => member.constructor.name === CLASS_NAME) as ReflectionClass[]; }

    getMember(name: string): ReflectionMember | undefined
    {
        return this.#members.find(member => member.name === name);
    }

    getDeclaration(name: string): ReflectionDeclaration | undefined
    {
        return this.declarations.find(member => member.name === name);
    }

    getFunction(name: string): ReflectionFunction | undefined
    {
        return this.functions.find(member => member.name === name);
    }

    getGetter(name: string): ReflectionGetter | undefined
    {
        return this.getters.find(member => member.name === name);
    }

    getSetter(name: string): ReflectionSetter | undefined
    {
        return this.setters.find(member => member.name === name);
    }

    getGenerator(name: string): ReflectionGenerator | undefined
    {
        return this.generators.find(member => member.name === name);
    }

    getClass(name: string): ReflectionClass | undefined
    {
        return this.classes.find(member => member.name === name);
    }

    hasMember(name: string): boolean
    {
        return this.getMember(name) !== undefined;
    }

    hasDeclaration(name: string): boolean
    {
        return this.getDeclaration(name) !== undefined;
    }

    hasFunction(name: string): boolean
    {
        return this.getFunction(name) !== undefined;
    }

    hasGetter(name: string): boolean
    {
        return this.getGetter(name) !== undefined;
    }

    hasSetter(name: string): boolean
    {
        return this.getSetter(name) !== undefined;
    }

    hasGenerator(name: string): boolean
    {
        return this.getGenerator(name) !== undefined;
    }

    hasClass(name: string): boolean
    {
        return this.getClass(name) !== undefined;
    }

    toString(): string
    {
        return this.#members.map(member => member.toString()).join('\n');
    }
}
