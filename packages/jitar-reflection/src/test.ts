
import ReflectionClass from './models/ReflectionClass.js';
import ReflectionField from './models/ReflectionField.js';
import ReflectionFunction from './models/ReflectionFunction.js';
import ReflectionGetter from './models/ReflectionGetter.js';
import ReflectionMember from './models/ReflectionMember.js';
import ReflectionSetter from './models/ReflectionSetter.js';
import Parser from './parser/Parser.js';

const code = `
import express from 'express';

const api = express();
api.use(express.json());

export class Person
{
    #name;
    #age = 42;

    static count = Math.round(10 * Math.random());

    constructor(name, age)
    {
        this.#name = name;
        this.#age = age;
    }

    get name() { return this.#name; }

    set name(value) { this.#name = value; }

    toString() { return this.#name + ' is ' + this.#age + ' years old'; }
}

const PI = 3.14;
const E = 2.71;

export { PI, E as Euler };

class Peter extends Person {}

export default async function createPerson(name, age = 42)
{
    return new Person(name, age);
}

function buildPeter() { return new Peter('Peter', 42); }
`;

const parser = new Parser();
const module = parser.parse(code);
const members = module.exported;

members.forEach(member => printMember(member));

function printMember(member: ReflectionMember, level = 0)
{
    if (member instanceof ReflectionClass)
    {
        printClass(member, level);
    }
    else if (member instanceof ReflectionGetter)
    {
        printGetter(member, level);
    }
    else if (member instanceof ReflectionSetter)
    {
        printSetter(member, level);
    }
    else if (member instanceof ReflectionFunction)
    {
        printFunction(member, level);
    }
    else if (member instanceof ReflectionField)
    {
        printField(member, level);
    }
}

function printClass(member: ReflectionClass, level:number)
{
    console.log(makeLevel(level), `Class ${member.name} ${member.parentName ? 'extends ' + member.parentName : ''}`);

    for (const submember of member.members)
    {
        printMember(submember, level + 1);
    }
}

function printGetter(member: ReflectionFunction, level:number)
{
    console.log(makeLevel(level), `${member.isStatic ? 'static ' : ''}get ${member.isPrivate ? '#' : ''}${member.name}() { ${member.body} }`);
}

function printSetter(member: ReflectionFunction, level:number)
{
    console.log(makeLevel(level), `${member.isStatic ? 'static ' : ''}set ${member.isPrivate ? '#' : ''}${member.name}(${member.parameters.map(parameter => parameter.name)}) { ${member.body} }`);
}

function printFunction(member: ReflectionFunction, level:number)
{
    console.log(makeLevel(level), `${member.isStatic ? 'static ' : ''}${member.isAsync ? 'async ' : ''}${level === 0 ? 'function ' : ''}${member.isPrivate ? '#' : ''}${member.name}(${member.parameters.map(parameter => parameter.name)}) { ${member.body} }`);
}

function printField(member: ReflectionField, level:number)
{
    level === 0
        ? console.log(makeLevel(level), `let ${member.name}${member.value ? ' = ' + member.value : ''};`)
        : console.log(makeLevel(level), `${member.isStatic ? 'static ' : ''}${member.isPrivate ? '#' : ''}${member.name}${member.value ? ' = ' + member.value : ''};`);
}

function makeLevel(level:number)
{
    let result = '';

    for (let i = 0; i < level; i++)
    {
        result += '  ';
    }

    return result;
}
