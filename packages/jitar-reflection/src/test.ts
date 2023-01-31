
import Parser from './parser/Parser.js';

const code = `
export class Person
{
    #name;
    #age;

    constructor(name, age)
    {
        this.#name = name;
        this.#age = age;
    }

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

console.log(module);
