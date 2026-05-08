
import { ESClass, ESConstructor, ESBlock, ESParameter, ESIdentifierBinding, ESExpression, ESField, ESMethod, ESGeneratorMethod, ESGetter, ESSetter } from '../../../src/model';

const members =
[
    new ESField('name', 'private', 'instance', new ESExpression('"Peter"')),
    new ESField('age', 'private', 'instance', undefined),
    new ESField('length', 'public', 'instance', undefined),
    new ESField('secret', 'private', 'instance', undefined),
    new ESConstructor([new ESParameter(new ESIdentifierBinding('age'), undefined)], new ESBlock('{ this.#age = age; }')),
    new ESGetter('name', 'public', 'instance', new ESBlock('{ return this.#name; }')),
    new ESGetter('age', 'public', 'instance', new ESBlock('{ return this.#age; }')),
    new ESSetter('age', 'public', 'instance', new ESParameter(new ESIdentifierBinding('age'), undefined), new ESBlock('{ this.#age = age; }')),
    new ESMethod('secretStuff', 'private', 'instance', [], new ESBlock('{ }')),
    new ESMethod('toString', 'public', 'instance', [], new ESBlock('{ return `${this.#name} (${this.#age})` }')),
    new ESGeneratorMethod('createJohn', 'public', 'instance', [], new ESBlock('{ }'))
];

export const esClass = new ESClass('Person', undefined, members);
