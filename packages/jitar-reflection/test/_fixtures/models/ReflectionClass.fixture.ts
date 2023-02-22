
import ReflectionScope from '../../../src/models/ReflectionScope';
import ReflectionField from '../../../src/models/ReflectionField';
import ReflectionExpression from '../../../src/models/ReflectionExpression';
import ReflectionFunction from '../../../src/models/ReflectionFunction';
import ReflectionClass from '../../../src/models/ReflectionClass';
import ReflectionGetter from '../../../src/models/ReflectionGetter';
import ReflectionSetter from '../../../src/models/ReflectionSetter';

const members =
[
    new ReflectionField('name', new ReflectionExpression('"Peter"'), false, true),
    new ReflectionField('age', undefined, false, true),
    new ReflectionField('length', undefined, false, false),
    new ReflectionField('secret', undefined, false, true),
    new ReflectionFunction('constructor', [new ReflectionField('age', undefined)], 'this.#age = age;'),
    new ReflectionGetter('name', [], 'return this.#name;'),
    new ReflectionGetter('age', [], 'return this.#age;'),
    new ReflectionSetter('age', [new ReflectionField('age', undefined)], 'this.#age = age;'),
    new ReflectionFunction('secretStuff', [], '', false, false, true),
    new ReflectionFunction('toString', [], 'return `${this.#name} (${this.#age})`'),
];

const scope = new ReflectionScope(members);
const reflectionClass = new ReflectionClass('Person', undefined, scope);

export { reflectionClass };
