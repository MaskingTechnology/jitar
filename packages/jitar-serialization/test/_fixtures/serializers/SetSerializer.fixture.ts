
const emptySet: Set<unknown> = new Set();
const mixedSet: Set<unknown> = new Set().add(1).add(true);
const nestedSet: Set<unknown> = new Set().add('hello').add(new Set().add(false));

const serializedEmptySet = { serialized: true, name: 'Set', values: [] };
const serializedMixedSet = { serialized: true, name: 'Set', values: [1, true] };
const serializedNestedSet = { serialized: true, name: 'Set', values: ['hello', { serialized: true, name: 'Set', values: [false] }] };

export {
    emptySet, mixedSet, nestedSet,
    serializedEmptySet, serializedMixedSet, serializedNestedSet
}
