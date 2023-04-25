
import ReflectionScope from '../../../src/models/ReflectionScope';
import ReflectionField from '../../../src/models/ReflectionField';
import ReflectionExpression from '../../../src/models/ReflectionExpression';
import ReflectionFunction from '../../../src/models/ReflectionFunction';
import ReflectionClass from '../../../src/models/ReflectionClass';
import ReflectionGetter from '../../../src/models/ReflectionGetter';
import ReflectionSetter from '../../../src/models/ReflectionSetter';
import ReflectionImport from '../../../src/models/ReflectionImport';
import ReflectionAlias from '../../../src/models/ReflectionAlias';
import ReflectionExport from '../../../src/models/ReflectionExport';
import ReflectionGenerator from '../../../src/models/ReflectionGenerator';
import ReflectionDeclaration from '../../../src/models/ReflectionDeclaration';

const members =
[
    new ReflectionImport([new ReflectionAlias('default', 'Person')], './Person.js'),
    new ReflectionDeclaration('name', new ReflectionExpression('"john"'), false, true),
    new ReflectionDeclaration('age', new ReflectionExpression('42'), false, true),
    new ReflectionFunction('createJohn', [], '{ return new Person("John") }'),
    new ReflectionFunction('sum', [new ReflectionField('a', undefined), new ReflectionField('b', undefined)], 'return a + b'),
    new ReflectionGetter('name', [], 'return this.#name;'),
    new ReflectionGetter('age', [], 'return this.#age;'),
    new ReflectionSetter('age', [new ReflectionField('age', undefined)], 'this.#age = age;'),
    new ReflectionClass('Customer', 'Person', new ReflectionScope([])),
    new ReflectionGenerator('createJohn', [], 'yield new Person("John")'),
    new ReflectionExport([new ReflectionAlias('Customer', 'Customer'), new ReflectionAlias('sum', 'default')], undefined)
];

const reflectionScope = new ReflectionScope(members);

export { reflectionScope };
