
import Serializer from '../../../src/Serializer';
import PrimitiveSerializer from '../../../src/serializers/PrimitiveSerializer';
import ArraySerializer from '../../../src/serializers/ArraySerializer';

const parent = new Serializer();
parent.addSerializer(new ArraySerializer());
parent.addSerializer(new PrimitiveSerializer());

const emptyArray: unknown[] = [];
const mixedArray: unknown[] = ['a', 1, true];
const nestedArray: unknown[] = ['b', 2, ['c', false], true];

const nonObject = 42;
const nonArray = new Map();

export {
    parent,
    emptyArray, mixedArray, nestedArray,
    nonObject, nonArray
}
