
import { ESImport, ESAlias, ESDeclaration, ESExpression, ESFunction, ESField, ESGenerator, ESClass, ESScope, ESExport, ESGetter, ESSetter } from '../../../src/models';

const members =
[
    new ESImport([new ESAlias('default', 'Person')], './Person.js'),
    new ESDeclaration('name', new ESExpression('"john"'), false, true),
    new ESDeclaration('age', new ESExpression('42'), false, true),
    new ESFunction('createJohn', [], '{ return new Person("John") }'),
    new ESFunction('sum', [new ESField('a', undefined), new ESField('b', undefined)], 'return a + b'),
    new ESGetter('name', [], 'return this.#name;'),
    new ESGetter('age', [], 'return this.#age;'),
    new ESSetter('age', [new ESField('age', undefined)], 'this.#age = age;'),
    new ESClass('Customer', 'Person', new ESScope([])),
    new ESGenerator('createJohn', [], 'yield new Person("John")'),
    new ESExport([new ESAlias('Customer', 'Customer'), new ESAlias('sum', 'default')], undefined)
];

export const esScope = new ESScope(members);
