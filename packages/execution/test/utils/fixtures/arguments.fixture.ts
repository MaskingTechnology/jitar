
export const ARGUMENTS =
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

    OPTIONAL_ARGUMENTS: new Map(Object.entries({ '*id': 1, '*name': 'John Doe', '*age': 42 })), // All arguments are optional
    OPTIONAL_ARGUMENTS_EXTRA: new Map(Object.entries({ 'id': 1, 'name': 'John Doe', '*additional': 'argument', '*ignore': true })), // Additional optional arguments
};
