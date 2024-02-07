
import ArrayParameter from '../../../src/models/ArrayParameter';
import NamedParameter from '../../../src/models/NamedParameter';
import ObjectParameter from '../../../src/models/ObjectParameter';

const PARAMETERS =
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
    REST_OBJECT: [new ObjectParameter([new NamedParameter('name', false), new NamedParameter('...rest', true)])],
    MIDDLEWARE: [new NamedParameter('id', true), new NamedParameter('name', true), new NamedParameter('age', true)]
};

const ARGUMENTS =
{
    NAMED_ALL: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', 'age': 42 })),
    NAMED_OPTIONAL: new Map(Object.entries({ 'id': 1, 'name': 'John Doe' })), // Misses the age
    NAMED_MISSING: new Map(Object.entries({ 'id': 1, 'age': 42 })), // Misses the name
    NAMED_EXTRA: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', 'age': 42, 'extra': 'extra' })),

    DESTRUCTURED_ALL: new Map(Object.entries({ 'query': 'foo', 'sort': 'bar' })),
    DESTRUCTURED_OPTIONAL: new Map(Object.entries({ 'query': 'foo' })), // Misses the sort
    DESTRUCTURED_MISSING: new Map(Object.entries({ 'sort': 'bar' })), // Misses the query
    DESTRUCTURED_EXTRA: new Map(Object.entries({ 'query': 'foo', 'sort': 'bar', 'extra': 'extra' })),

    MIXED_ALL: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', 'age': 42, 'query': 'foo', 'sort': 'bar' })),
    MIXED_OPTIONAL: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', 'query': 'foo' })), // Misses the age
    MIXED_MISSING: new Map(Object.entries({ 'id': 1, 'age': 42, 'query': 'foo', 'sort': 'bar' })), // Misses the name
    MIXED_EXTRA: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', 'age': 42, 'query': 'foo', 'sort': 'bar', 'extra': 'extra' })),

    NESTED_ALL: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', 'age': 42, 'query': 'foo', 'sort': 'bar' })),
    NESTED_OPTIONAL: new Map(Object.entries({ 'id': 1, 'name': 'John Doe' })), // Misses filter data as a whole
    NESTED_MISSING: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', 'age': 42, 'query': 'foo' })), // Misses the sort of the filter data
    NESTED_EXTRA: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', 'age': 42, 'query': 'foo', 'sort': 'bar', 'extra': 'extra' })),

    REST_VALID: new Map(Object.entries({ '...rest': ['foo', 'bar'] })),
    REST_INVALID: new Map(Object.entries({ '...rest': 'foo' })),

    REST_ARRAY_VALID: new Map(Object.entries({ 'name': 'John Doe', '...rest': ['foo', 'bar'] })),
    REST_ARRAY_INVALID: new Map(Object.entries({ 'name': 'John Doe', '...rest': 'foo' })),

    REST_OBJECT_VALID: new Map(Object.entries({ 'name': 'John Doe', '...rest': { 'first': 'foo', 'second': 'bar' }})),
    REST_OBJECT_INVALID: new Map(Object.entries({ 'name': 'John Doe', '...rest': 'foo' })),

    MIDDLEWARE_OPTIONAL: new Map(Object.entries({ '*id': 1, '*name': 'John Doe', '*age': 42 })), // All arguments are optional
    MIDDLEWARE_EXTRA: new Map(Object.entries({ 'id': 1, '*additional': 'argument', '*ignore': true })), // Additional optional arguments
};

export { PARAMETERS, ARGUMENTS };
