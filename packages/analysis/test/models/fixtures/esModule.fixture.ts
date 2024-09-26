
import { ESImport, ESAlias, ESDeclaration, ESExpression, ESFunction, ESField, ESGenerator, ESClass, ESScope, ESExport, ESModule } from '../../../src/models';

const members =
[
    new ESImport([new ESAlias('default', 'Person')], './Person.js'),
    new ESDeclaration('peter', new ESExpression('new Person("Peter")')),
    new ESDeclaration('bas', new ESExpression('new Person("Bas")')),
    new ESFunction('createJohn', [], 'return new Person("John")'),
    new ESFunction('sum', [new ESField('a', undefined), new ESField('b', undefined)], 'return a + b'),
    new ESGenerator('generateNumbers', [new ESField('count', undefined)], 'for (let i = 0; i < count; i++) yield i;'),
    new ESGenerator('createJohn', [], 'yield new Person("John")'),
    new ESClass('Customer', 'Person', new ESScope([])),
    new ESClass('Order', undefined, new ESScope([])),
    new ESExport([
        new ESAlias('sum', 'default'),
        new ESAlias('peter', 'peter'),
        new ESAlias('Customer', 'Customer'),
        new ESAlias('generateNumbers', 'generateNumbers')
    ], undefined)
];

const scope = new ESScope(members);

export const esModule = new ESModule(scope);
