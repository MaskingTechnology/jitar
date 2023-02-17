
import ReflectionScope from '../../../src/models/ReflectionScope';
import ReflectionModule from '../../../src/models/ReflectionModule';
import ReflectionImport from '../../../src/models/ReflectionImport';
import ReflectionAlias from '../../../src/models/ReflectionAlias';
import ReflectionField from '../../../src/models/ReflectionField';
import ReflectionExpression from '../../../src/models/ReflectionExpression';
import ReflectionFunction from '../../../src/models/ReflectionFunction';
import ReflectionClass from '../../../src/models/ReflectionClass';
import ReflectionExport from '../../../src/models/ReflectionExport';

const members =
[
    new ReflectionImport([new ReflectionAlias('default', 'Person')], './Person.js'),
    new ReflectionField('peter', new ReflectionExpression('new Person("Peter")')),
    new ReflectionField('bas', new ReflectionExpression('new Person("Bas")')),
    new ReflectionFunction('createJohn', [], 'return new Person("John")'),
    new ReflectionFunction('sum', [new ReflectionField('a', undefined), new ReflectionField('b', undefined)], 'return a + b'),
    new ReflectionClass('Customer', 'Person', new ReflectionScope([])),
    new ReflectionExport([new ReflectionAlias('peter', 'peter'), new ReflectionAlias('sum', 'default')], undefined)
];

const scope = new ReflectionScope(members);
const reflectionModule = new ReflectionModule(scope);

export { reflectionModule };
