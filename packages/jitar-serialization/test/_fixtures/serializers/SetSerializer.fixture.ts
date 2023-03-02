
import Serializer from "../../../src/Serializer";
import PrimitiveSerializer from "../../../src/serializers/PrimitiveSerializer";
import SetSerializer from "../../../src/serializers/SetSerializer";

const parent = new Serializer();
parent.addSerializer(new SetSerializer());
parent.addSerializer(new PrimitiveSerializer());

const emptySet: Set<unknown> = new Set();
const mixedSet: Set<unknown> = new Set().add(1).add(true);
const nestedSet: Set<unknown> = new Set().add('hello').add(new Set().add(false));

const serializedEmptySet = { serialized: true, name: 'Set', values: [] };
const serializedMixedSet = { serialized: true, name: 'Set', values: [1, true] };
const serializedNestedSet = { serialized: true, name: 'Set', values: ['hello', { serialized: true, name: 'Set', values: [false] }] };

const nonObject = 42;
const nonSet = new Map();
const notSerialized = { name: 'Set', type: 'Set', bytes: [] };
const wrongName = { serialized: true, name: 'Map', values: [] };
const wrongValues = { serialized: true, name: 'Set', values: {} };

export {
    parent,
    emptySet, mixedSet, nestedSet,
    serializedEmptySet, serializedMixedSet, serializedNestedSet,
    nonObject, nonSet, notSerialized, wrongName, wrongValues
}
