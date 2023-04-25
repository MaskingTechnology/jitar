
import Serializer from '../../../src/Serializer';
import PrimitiveSerializer from '../../../src/serializers/PrimitiveSerializer';
import MapSerializer from '../../../src/serializers/MapSerializer';

const parent = new Serializer();
parent.addSerializer(new MapSerializer());
parent.addSerializer(new PrimitiveSerializer());

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

export {
    parent,
    emptyMap, mixedMap, nestedMap,
    serializedEmptyMap, serializedMixedMap, serializedNestedMap,
    nonObject, nonMap, notSerialized, invalidName, invalidKeys, invalidValues
};
