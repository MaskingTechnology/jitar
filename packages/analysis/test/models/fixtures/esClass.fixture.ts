
import { ESClass, ESDeclaration, ESExpression, ESField, ESFunction, ESGetter, ESScope, ESSetter } from '../../../src/models';

const members =
[
    new ESDeclaration('name', new ESExpression('"Peter"'), false, true),
    new ESDeclaration('age', undefined, false, true),
    new ESDeclaration('length', undefined, false, false),
    new ESDeclaration('secret', undefined, false, true),
    new ESFunction('constructor', [new ESField('age', undefined)], 'this.#age = age;'),
    new ESGetter('name', [], 'return this.#name;'),
    new ESGetter('age', [], 'return this.#age;'),
    new ESSetter('age', [new ESField('age', undefined)], 'this.#age = age;'),
    new ESFunction('secretStuff', [], '', false, false, true),
    new ESFunction('toString', [], 'return `${this.#name} (${this.#age})`'),
];

const scope = new ESScope(members);

export const esClass = new ESClass('Person', undefined, scope);
