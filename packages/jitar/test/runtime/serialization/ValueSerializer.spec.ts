
import { describe, expect, it } from 'vitest';

import
{
    numberValue, boolValue, stringValue, nullValue, undefinedValue,
    emptyArray, mixedArray, nestedArray,
    emptyObject, mixedObject, nestedObject,
    fixedDate, serializedFixedDate, serializedInvalidDateValue, serializedInvalidDateString,
    emptyMap, mixedMap, nestedMap, serializedEmptyMap, serializedMixedMap, serializedNestedMap,
    emptySet, mixedSet, nestedSet, serializedEmptySet, serializedMixedSet, serializedNestedSet,
    dataClass, constructedClass, nestedClass, serializedDataClass, serializedConstructedClass, serializedNestedClass,
    serializedInvalidClass, serializedUnserializableClass,
    privateClass, serializedPrivateClass,
    errorClass, serializedError,
    jitarViewUint16, serializedJitarViewUint16, jitarViewInt8, SerializedJitarViewInt8, jitarViewBigInt64, SerializedJitarViewBigInt64,
    SerializedJitarViewInt7, SerializedJitarViewString8
} from '../../_fixtures/runtime/serialization/ValueSerializer.fixture';

import ValueSerializer from '../../../src/runtime/serialization/ValueSerializer';
import ClassNotFound from '../../../src/runtime/serialization/errors/ClassNotFound';
import InvalidClass from '../../../src/runtime/serialization/errors/InvalidClass';
import InvalidPropertyType from '../../../src/runtime/serialization/errors/InvalidPropertyType';

describe('serialization/ValueSerializer', () =>
{
    describe('.serialize(value)', () =>
    {
        it('should serialize primitive values', () =>
        {
            const number = ValueSerializer.serialize(numberValue);
            const bool = ValueSerializer.serialize(numberValue);
            const string = ValueSerializer.serialize(stringValue);
            const none = ValueSerializer.serialize(nullValue);
            const notset = ValueSerializer.serialize(undefinedValue);

            expect(number).toBe(numberValue);
            expect(bool).toBe(numberValue);
            expect(string).toBe(stringValue);
            expect(none).toBe(nullValue);
            expect(notset).toBe(undefinedValue);
        });

        it('should serialize date values', () =>
        {
            const date = ValueSerializer.serialize(fixedDate);

            expect(date).toEqual(serializedFixedDate);
        });

        it('should serialize arrays', () =>
        {
            const empty = ValueSerializer.serialize(emptyArray);
            const mixed = ValueSerializer.serialize(mixedArray);
            const nested = ValueSerializer.serialize(nestedArray);

            expect(empty).toEqual(emptyArray);
            expect(mixed).toEqual(mixedArray);
            expect(nested).toEqual(nestedArray);
        });

        it('should serialize objects', () =>
        {
            const empty = ValueSerializer.serialize(emptyObject);
            const mixed = ValueSerializer.serialize(mixedObject);
            const nested = ValueSerializer.serialize(nestedObject);

            expect(empty).toEqual(emptyObject);
            expect(mixed).toEqual(mixedObject);
            expect(nested).toEqual(nestedObject);
        });

        it('should serialize maps', () =>
        {
            const empty = ValueSerializer.serialize(emptyMap);
            const mixed = ValueSerializer.serialize(mixedMap);
            const nested = ValueSerializer.serialize(nestedMap);

            expect(empty).toEqual(serializedEmptyMap);
            expect(mixed).toEqual(serializedMixedMap);
            expect(nested).toEqual(serializedNestedMap);
        });

        it('should serialize sets', () =>
        {
            const empty = ValueSerializer.serialize(emptySet);
            const mixed = ValueSerializer.serialize(mixedSet);
            const nested = ValueSerializer.serialize(nestedSet);

            expect(empty).toEqual(serializedEmptySet);
            expect(mixed).toEqual(serializedMixedSet);
            expect(nested).toEqual(serializedNestedSet);
        });

        it('should serialize error', () =>
        {
            const error = ValueSerializer.serialize(errorClass) as unknown;

            expect(error).toEqual(serializedError);
        });

        it('should serialize instances', () =>
        {
            const data = ValueSerializer.serialize(dataClass);
            const constructed = ValueSerializer.serialize(constructedClass);
            const nested = ValueSerializer.serialize(nestedClass);

            expect(data).toEqual(serializedDataClass);
            expect(constructed).toEqual(serializedConstructedClass);
            expect(nested).toEqual(serializedNestedClass);

        });

        it('should not serialize set or get only variables', () =>
        {
            const clazz = ValueSerializer.serialize(privateClass);

            expect(clazz).toEqual(serializedPrivateClass);

        });

        it('should serialize array buffer', () =>
        {
            const viewUint16 = ValueSerializer.serialize(jitarViewUint16);
            const viewInt8 = ValueSerializer.serialize(jitarViewInt8);
            const viewBigInt64 = ValueSerializer.serialize(jitarViewBigInt64);

            expect(viewUint16).toEqual(serializedJitarViewUint16);
            expect(viewInt8).toEqual(SerializedJitarViewInt8);
            expect(viewBigInt64).toEqual(SerializedJitarViewBigInt64);
        });
    });

    describe('.deserialize(value)', () =>
    {
        it('should deserialize primitive values', async () =>
        {
            const number = await ValueSerializer.deserialize(numberValue);
            const bool = await ValueSerializer.deserialize(boolValue);
            const string = await ValueSerializer.deserialize(undefinedValue);
            const none = await ValueSerializer.deserialize(nullValue);
            const notset = await ValueSerializer.deserialize(undefinedValue);

            expect(number).toBe(numberValue);
            expect(bool).toBe(boolValue);
            expect(string).toBe(undefinedValue);
            expect(none).toBe(nullValue);
            expect(notset).toBe(undefinedValue);
        });

        it('should deserialize date values', async () =>
        {
            const date = await ValueSerializer.deserialize(serializedFixedDate);

            expect(date).toEqual(fixedDate);
        });

        it('should deserialize arrays', async () =>
        {
            const empty = await ValueSerializer.deserialize(emptyArray);
            const mixed = await ValueSerializer.deserialize(mixedArray);
            const nested = await ValueSerializer.deserialize(nestedArray);

            expect(empty).toEqual(emptyArray);
            expect(mixed).toEqual(mixedArray);
            expect(nested).toEqual(nestedArray);
        });

        it('should deserialize plain objects', async () =>
        {
            const empty = await ValueSerializer.deserialize(emptyObject);
            const mixed = await ValueSerializer.deserialize(mixedObject);
            const nested = await ValueSerializer.deserialize(nestedObject);

            expect(empty).toEqual(emptyObject);
            expect(mixed).toEqual(mixedObject);
            expect(nested).toEqual(nestedObject);
        });

        it('should deserialize maps', async () =>
        {
            const empty = await ValueSerializer.deserialize(serializedEmptyMap);
            const mixed = await ValueSerializer.deserialize(serializedMixedMap);
            const nested = await ValueSerializer.deserialize(serializedNestedMap);

            expect(empty).toEqual(emptyMap);
            expect(mixed).toEqual(mixedMap);
            expect(nested).toEqual(nestedMap);
        });

        it('should deserialize sets', async () =>
        {
            const empty = await ValueSerializer.deserialize(serializedEmptySet);
            const mixed = await ValueSerializer.deserialize(serializedMixedSet);
            const nested = await ValueSerializer.deserialize(serializedNestedSet);

            expect(empty).toEqual(emptySet);
            expect(mixed).toEqual(mixedSet);
            expect(nested).toEqual(nestedSet);
        });

        it('should deserialize error', async () =>
        {
            const empty = await ValueSerializer.deserialize(serializedError);

            expect(empty).toEqual(errorClass);
        });

        it('should deserialize instances', async () =>
        {
            const data = await ValueSerializer.deserialize(serializedDataClass);
            const constructed = await ValueSerializer.deserialize(serializedConstructedClass);
            const nested = await ValueSerializer.deserialize(serializedNestedClass);

            expect(data).toEqual(dataClass);
            expect(constructed).toEqual(constructedClass);
            expect(nested).toEqual(nestedClass);
        });

        it('should not deserialize invalid objects', async () =>
        {
            const deserialize = async () => await ValueSerializer.deserialize(serializedInvalidClass);

            expect(deserialize).rejects.toEqual(new ClassNotFound('Invalid'));
        });

        it('should not deserialize non-function instances', async () =>
        {
            const deserialize = async () => await ValueSerializer.deserialize(serializedUnserializableClass);

            expect(deserialize).rejects.toEqual(new InvalidClass('Infinity'));
        });

        it('should not deserialize invalid date objects', async () =>
        {
            const invalidDateValue = async () => await ValueSerializer.deserialize(serializedInvalidDateValue);
            const invalidDateString = async () => await ValueSerializer.deserialize(serializedInvalidDateString);

            expect(invalidDateValue).rejects.toEqual(new InvalidPropertyType('date', 'value', 'string'));
            expect(invalidDateString).rejects.toEqual(new InvalidPropertyType('date', 'value', 'date'));
        });

        it('should deserialize array buffer', async () =>
        {
            const viewUint16 = await ValueSerializer.deserialize(serializedJitarViewUint16);
            const viewInt8 = await ValueSerializer.deserialize(SerializedJitarViewInt8);
            const viewBigInt64 = await ValueSerializer.deserialize(SerializedJitarViewBigInt64);

            expect(viewUint16).toEqual(jitarViewUint16);
            expect(viewInt8).toEqual(jitarViewInt8);
            expect(viewBigInt64).toEqual(jitarViewBigInt64);
        });

        it('should not deserialize invalid array buffer instances', async () =>
        {
            const viewInt7 = async () => await ValueSerializer.deserialize(SerializedJitarViewInt7);
            const viewString8 = async () => await ValueSerializer.deserialize(SerializedJitarViewString8);

            expect(viewInt7).rejects.toEqual(new InvalidPropertyType('ArrayBuffer', 'type', 'TypedArray'));
            expect(viewString8).rejects.toEqual(new InvalidPropertyType('ArrayBuffer', 'bytes', 'Array'));
        });
    });
});
