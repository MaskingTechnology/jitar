
import ArrayParameter from '../../../src/models/ArrayParameter';
import NamedParameter from '../../../src/models/NamedParameter';
import ObjectParameter from '../../../src/models/ObjectParameter';

export const PARAMETERS =
{
    NAMED: [new NamedParameter('id', false), new NamedParameter('name', false), new NamedParameter('age', true)],
    ARRAY: [new ArrayParameter([new NamedParameter('query', false), new NamedParameter('sort', true)])],
    OBJECT: [new ObjectParameter([new NamedParameter('query', false), new NamedParameter('sort', true)])],
    MIXED: [
        new NamedParameter('id', false),
        new ArrayParameter([new NamedParameter('name', false), new NamedParameter('age', true)]),
        new ObjectParameter([new NamedParameter('query', false), new NamedParameter('sort', true)])
    ],
    NESTED_ARRAY: [
        new ArrayParameter([
            new NamedParameter('id', false),
            new ArrayParameter([new NamedParameter('name', false), new NamedParameter('age', true)]),
            new ObjectParameter([new NamedParameter('query', false), new NamedParameter('sort', false)], undefined, true)
        ])
    ],
    NESTED_OBJECT: [
        new ObjectParameter([
            new NamedParameter('id', false),
            new ArrayParameter([new NamedParameter('name', false), new NamedParameter('age', true)], 'person'),
            new ObjectParameter([new NamedParameter('query', false), new NamedParameter('sort', false)], 'filter', true)
        ])
    ],
    REST: [new NamedParameter('...rest', false)],
    REST_ARRAY: [new ArrayParameter([new NamedParameter('name', false), new NamedParameter('...rest', true)])],
    REST_OBJECT: [new ObjectParameter([new NamedParameter('name', false), new NamedParameter('...rest', true)])]
};
