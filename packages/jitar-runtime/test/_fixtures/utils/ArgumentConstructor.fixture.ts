
import ArrayParameter from '../../../src/models/ArrayParameter';
import NamedParameter from '../../../src/models/NamedParameter';
import ObjectParameter from '../../../src/models/ObjectParameter';

const PARAMETERS =
{
    NAMED: [new NamedParameter('id', false), new NamedParameter('name', false), new NamedParameter('age', true)],
    ARRAY: [new ArrayParameter([new NamedParameter('query', false), new NamedParameter('sort', true)])],
    OBJECT: [new ObjectParameter([new NamedParameter('query', false), new NamedParameter('sort', true)])]
}

const ARGUMENTS =
{
    NAMED_ALL: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', 'age': 42 })),
    NAMED_OPTIONAL: new Map(Object.entries({ 'id': 1, 'name': 'John Doe' })),
    NAMED_MISSING: new Map(Object.entries({ 'id': 1, 'age': 42 })),
    NAMED_EXTRA: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', 'age': 42, 'extra': 'extra' })),

    DESTRUCTURED_ALL: new Map(Object.entries({ 'query': 'foo', 'sort': 'bar' })),
    DESTRUCTURED_OPTIONAL: new Map(Object.entries({ 'query': 'foo' })),
    DESTRUCTURED_MISSING: new Map(Object.entries({ 'sort': 'bar' })),
    DESTRUCTURED_EXTRA: new Map(Object.entries({ 'query': 'foo', 'sort': 'bar', 'extra': 'extra' }))
}

export { PARAMETERS, ARGUMENTS }
