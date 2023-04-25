
import ReflectionScope from '../../../src/models/ReflectionScope';
import ReflectionModule from '../../../src/models/ReflectionModule';
import ReflectionImport from '../../../src/models/ReflectionImport';
import ReflectionAlias from '../../../src/models/ReflectionAlias';
import ReflectionField from '../../../src/models/ReflectionField';
import ReflectionExpression from '../../../src/models/ReflectionExpression';
import ReflectionFunction from '../../../src/models/ReflectionFunction';
import ReflectionClass from '../../../src/models/ReflectionClass';
import ReflectionExport from '../../../src/models/ReflectionExport';
import ReflectionGenerator from '../../../src/models/ReflectionGenerator';
import ReflectionDeclaration from '../../../src/models/ReflectionDeclaration';

const members =
[
    new ReflectionImport([new ReflectionAlias('default', 'Person')], './Person.js'),
    new ReflectionDeclaration('peter', new ReflectionExpression('new Person("Peter")')),
    new ReflectionDeclaration('bas', new ReflectionExpression('new Person("Bas")')),
    new ReflectionFunction('createJohn', [], 'return new Person("John")'),
    new ReflectionFunction('sum', [new ReflectionField('a', undefined), new ReflectionField('b', undefined)], 'return a + b'),
    new ReflectionGenerator('generateNumbers', [new ReflectionField('count', undefined)], 'for (let i = 0; i < count; i++) yield i;'),
    new ReflectionGenerator('createJohn', [], 'yield new Person("John")'),
    new ReflectionClass('Customer', 'Person', new ReflectionScope([])),
    new ReflectionClass('Order', undefined, new ReflectionScope([])),
    new ReflectionExport([
        new ReflectionAlias('sum', 'default'),
        new ReflectionAlias('peter', 'peter'),
        new ReflectionAlias('Customer', 'Customer'),
        new ReflectionAlias('generateNumbers', 'generateNumbers')
    ], undefined)
];

const scope = new ReflectionScope(members);
const reflectionModule = new ReflectionModule(scope);

export { reflectionModule };
