
const emptySet: Set<unknown> = new Set();
const mixedSet: Set<unknown> = new Set().add(1).add(true);
const nestedSet: Set<unknown> = new Set().add('hello').add(new Set().add(false));

const serializedEmptySet = { serialized: true, name: 'Set', values: [] };
const serializedMixedSet = { serialized: true, name: 'Set', values: [1, true] };
const serializedNestedSet = { serialized: true, name: 'Set', values: ['hello', { serialized: true, name: 'Set', values: [false] }] };

const nonObject = 42;
const nonSet = new Map();
const notSerialized = { name: 'Set', bytes: [] };
const invalidName = { serialized: true, name: 'Map', values: [] };
const invalidValues = { serialized: true, name: 'Set', values: {} };

export const SETS =
{
    EMPTY: emptySet,
    EMPTY_SERIALIZED: serializedEmptySet,
    MIXED: mixedSet,
    MIXED_SERIALIZED: serializedMixedSet,
    NESTED: nestedSet,
    NESTED_SERIALIZED: serializedNestedSet,
    NON_OBJECT: nonObject,
    NON_SET: nonSet,
    NOT_SERIALIZED: notSerialized,
    INVALID_NAME: invalidName,
    INVALID_VALUES: invalidValues
};
