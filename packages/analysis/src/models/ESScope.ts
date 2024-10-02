
import ESMember from './ESMember.js';
import ESGetter from './ESGetter.js';
import ESSetter from './ESSetter.js';
import ESFunction from './ESFunction.js';
import ESClass from './ESClass.js';
import ESImport from './ESImport.js';
import ESExport from './ESExport.js';
import ESGenerator from './ESGenerator.js';
import ESDeclaration from './ESDeclaration.js';

// Required to work after minification.
const IMPORT_NAME = ESImport.name;
const EXPORT_NAME = ESExport.name;
const DECLARATION_NAME = ESDeclaration.name;
const FUNCTION_NAME = ESFunction.name;
const GETTER_NAME = ESGetter.name;
const SETTER_NAME = ESSetter.name;
const GENERATOR_NAME = ESGenerator.name;
const CLASS_NAME = ESClass.name;

export default class ESScope
{
    #members: ESMember[];

    constructor(members: ESMember[])
    {
        this.#members = members;
    }

    // The constructor name is used to determine the type of the member.
    // This makes sure that the member is of the exact type and not a subclass.

    get members(): ESMember[] { return this.#members; }

    get imports(): ESImport[] { return this.#members.filter(member => member.constructor.name === IMPORT_NAME) as ESImport[]; }

    get exports(): ESExport[] { return this.#members.filter(member => member.constructor.name === EXPORT_NAME) as ESExport[]; }

    get declarations(): ESDeclaration[] { return this.#members.filter(member => member.constructor.name === DECLARATION_NAME) as ESDeclaration[]; }

    get functions(): ESFunction[] { return this.#members.filter(member => member.constructor.name === FUNCTION_NAME) as ESFunction[]; }

    get getters(): ESGetter[] { return this.#members.filter(member => member.constructor.name === GETTER_NAME) as ESGetter[]; }

    get setters(): ESSetter[] { return this.#members.filter(member => member.constructor.name === SETTER_NAME) as ESSetter[]; }

    get generators(): ESGenerator[] { return this.#members.filter(member => member.constructor.name === GENERATOR_NAME) as ESGenerator[]; }

    get classes(): ESClass[] { return this.#members.filter(member => member.constructor.name === CLASS_NAME) as ESClass[]; }

    getMember(name: string): ESMember | undefined
    {
        return this.#members.find(member => member.name === name);
    }

    getDeclaration(name: string): ESDeclaration | undefined
    {
        return this.declarations.find(member => member.name === name);
    }

    getFunction(name: string): ESFunction | undefined
    {
        return this.functions.find(member => member.name === name);
    }

    getGetter(name: string): ESGetter | undefined
    {
        return this.getters.find(member => member.name === name);
    }

    getSetter(name: string): ESSetter | undefined
    {
        return this.setters.find(member => member.name === name);
    }

    getGenerator(name: string): ESGenerator | undefined
    {
        return this.generators.find(member => member.name === name);
    }

    getClass(name: string): ESClass | undefined
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
