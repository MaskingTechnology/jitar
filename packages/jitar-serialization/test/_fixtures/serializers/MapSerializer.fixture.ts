
const emptyMap: Map<unknown, unknown> = new Map();
const mixedMap: Map<unknown, unknown> = new Map().set('a', 1).set('b', true);
const nestedMap: Map<unknown, unknown> = new Map().set('b', 'hello').set('c', new Map().set('d', false));

const serializedEmptyMap = { serialized: true, name: 'Map', entries: { keys: [], values: [] } };
const serializedMixedMap = { serialized: true, name: 'Map', entries: { keys: ['a', 'b'], values: [1, true] } }
const serializedNestedMap = { serialized: true, name: 'Map', entries: { keys: ['b', 'c'], values: ['hello', { serialized: true, name: 'Map', entries: { keys: ['d'], values: [false] } }] } }

export {
    emptyMap, mixedMap, nestedMap,
    serializedEmptyMap, serializedMixedMap, serializedNestedMap
}
