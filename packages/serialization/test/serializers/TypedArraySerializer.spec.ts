
import { describe, expect, it } from 'vitest';

import TypedArraySerializer from '../../src/serializers/TypedArraySerializer';

import { TYPED_ARRAYS } from './fixtures';

const serializer = new TypedArraySerializer();

describe('serializers/TypedArraySerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an array buffer', () =>
        {
            const supportsUint16 = serializer.canSerialize(TYPED_ARRAYS.UINT16);
            const supportsInt8 = serializer.canSerialize(TYPED_ARRAYS.INT8);
            const supportsBigInt64 = serializer.canSerialize(TYPED_ARRAYS.BIG_INT64);

            expect(supportsUint16).toBeTruthy();
            expect(supportsInt8).toBeTruthy();
            expect(supportsBigInt64).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsPlainObject = serializer.canSerialize(TYPED_ARRAYS.PLAIN_OBJECT);
            const supportsNonObject = serializer.canSerialize(TYPED_ARRAYS.NON_OBJECT);

            expect(supportsPlainObject).toBeFalsy();
            expect(supportsNonObject).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an array buffer', () =>
        {
            const supportsUint16 = serializer.canDeserialize(TYPED_ARRAYS.UINT16_SERIALIZED);
            const supportsInt8 = serializer.canDeserialize(TYPED_ARRAYS.INT8_SERIALIZED);
            const supportsBigInt64 = serializer.canDeserialize(TYPED_ARRAYS.BIG_INT64_SERIALIZED);

            expect(supportsUint16).toBeTruthy();
            expect(supportsInt8).toBeTruthy();
            expect(supportsBigInt64).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(TYPED_ARRAYS.NON_OBJECT);
            const supportsNotSerialized = serializer.canDeserialize(TYPED_ARRAYS.NOT_SERIALIZED);
            const supportsInvalidName = serializer.canDeserialize(TYPED_ARRAYS.INVALID_NAME);
            const supportsInvalidType = serializer.canDeserialize(TYPED_ARRAYS.INVALID_TYPE);
            const supportsInvalidBytes = serializer.canDeserialize(TYPED_ARRAYS.INVALID_BYTES);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidType).toBeFalsy();
            expect(supportsInvalidBytes).toBeFalsy();
        });
    });

    describe('.serialize(array)', () =>
    {
        it('should serialize an array buffer', async () =>
        {
            const resultUint16 = await serializer.serialize(TYPED_ARRAYS.UINT16);
            const resultInt8 = await serializer.serialize(TYPED_ARRAYS.INT8);
            const resultBigInt64 = await serializer.serialize(TYPED_ARRAYS.BIG_INT64);

            expect(resultUint16).toStrictEqual(TYPED_ARRAYS.UINT16_SERIALIZED);
            expect(resultInt8).toStrictEqual(TYPED_ARRAYS.INT8_SERIALIZED);
            expect(resultBigInt64).toStrictEqual(TYPED_ARRAYS.BIG_INT64_SERIALIZED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize an array buffer', async () =>
        {
            const resultUint16 = await serializer.deserialize(TYPED_ARRAYS.UINT16_SERIALIZED);
            const resultInt8 = await serializer.deserialize(TYPED_ARRAYS.INT8_SERIALIZED);
            const resultBigInt64 = await serializer.deserialize(TYPED_ARRAYS.BIG_INT64_SERIALIZED);

            expect(resultUint16).toStrictEqual(TYPED_ARRAYS.UINT16);
            expect(resultInt8).toStrictEqual(TYPED_ARRAYS.INT8);
            expect(resultBigInt64).toStrictEqual(TYPED_ARRAYS.BIG_INT64);
        });
    });
});
