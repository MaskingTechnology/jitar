
const emptyMap: Map<unknown, unknown> = new Map();
const mixedMap: Map<unknown, unknown> = new Map().set('a', 1).set('b', true);
const nestedMap: Map<unknown, unknown> = new Map().set('b', 'hello').set('c', new Map().set('d', false));

const serializedEmptyMap = { serialized: true, name: 'Map', entries: { keys: [], values: [] } };
const serializedMixedMap = { serialized: true, name: 'Map', entries: { keys: ['a', 'b'], values: [1, true] } };
const serializedNestedMap = { serialized: true, name: 'Map', entries: { keys: ['b', 'c'], values: ['hello', { serialized: true, name: 'Map', entries: { keys: ['d'], values: [false] } }] } };

const nonObject = 42;
const nonMap = new Set();
const notSerialized = { name: 'Map', entries: [], values: [] };
const invalidName = { serialized: true, name: 'Set', entries: [], values: [] };
const invalidKeys = { serialized: true, name: 'Map', entries: {}, values: [] };
const invalidValues = { serialized: true, name: 'Map', entries: [], values: {} };

export const MAPS =
{
    EMPTY: emptyMap,
    EMPTY_SERIALIZED: serializedEmptyMap,
    MIXED: mixedMap,
    MIXED_SERIALIZED: serializedMixedMap,
    NESTED: nestedMap,
    NESTED_SERIALIZED: serializedNestedMap,
    NON_OBJECT: nonObject,
    NON_MAP: nonMap,
    NOT_SERIALIZED: notSerialized,
    INVALID_NAME: invalidName,
    INVALID_KEYS: invalidKeys,
    INVALID_VALUES: invalidValues
};
