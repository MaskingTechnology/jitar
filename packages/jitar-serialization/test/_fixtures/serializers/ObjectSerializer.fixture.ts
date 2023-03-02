
import Serializer from "../../../src/Serializer";
import PrimitiveSerializer from "../../../src/serializers/PrimitiveSerializer";
import ObjectSerializer from "../../../src/serializers/ObjectSerializer";

const parent = new Serializer();
parent.addSerializer(new ObjectSerializer());
parent.addSerializer(new PrimitiveSerializer());

const emptyObject = {};
const mixedObject = { a: 1, b: true, c: 'hello' };
const nestedObject = { a: 1, b: true, c: { d: false, e: true } };

const nonObject = 42;
const specificObject = new Map();

export {
    parent,
    emptyObject, mixedObject, nestedObject,
    nonObject, specificObject
}
