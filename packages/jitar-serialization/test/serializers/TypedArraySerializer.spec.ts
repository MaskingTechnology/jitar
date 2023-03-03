
import { describe, expect, it } from 'vitest';

import TypedArraySerializer from '../../src/serializers/TypedArraySerializer';

import {
    viewUint16, viewInt8, viewBigInt64,
    serializedViewUint16, serializedViewInt8, serializedViewBigInt64,
    nonObject, notSerialized, invalidName, invalidType, invalidBytes
} from '../_fixtures/serializers/TypedArraySerializer.fixture';

const serializer = new TypedArraySerializer();

describe('serializers/TypedArraySerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an array buffer', () =>
        {
            const supportsUint16 = serializer.canSerialize(viewUint16);
            const supportsInt8 = serializer.canSerialize(viewInt8);
            const supportsBigInt64 = serializer.canSerialize(viewBigInt64);

            expect(supportsUint16).toBeTruthy();
            expect(supportsInt8).toBeTruthy();
            expect(supportsBigInt64).toBeTruthy();
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsPlainObject = serializer.canSerialize({});
            const supportsNonObject = serializer.canSerialize(nonObject);

            expect(supportsPlainObject).toBeFalsy();
            expect(supportsNonObject).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an array buffer', () =>
        {
            const supportsUint16 = serializer.canDeserialize(serializedViewUint16);
            const supportsInt8 = serializer.canDeserialize(serializedViewInt8);
            const supportsBigInt64 = serializer.canDeserialize(serializedViewBigInt64);

            expect(supportsUint16).toBeTruthy();
            expect(supportsInt8).toBeTruthy();
            expect(supportsBigInt64).toBeTruthy();
        });

        it('should tell it can not deserialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNotSerialized = serializer.canSerialize(notSerialized);
            const supportsInvalidName = serializer.canSerialize(invalidName);
            const supportsInvalidType = serializer.canSerialize(invalidType);
            const supportsInvalidBytes = serializer.canSerialize(invalidBytes);

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
            const resultUint16 = await serializer.serialize(viewUint16);
            const resultInt8 = await serializer.serialize(viewInt8);
            const resultBigInt64 = await serializer.serialize(viewBigInt64);

            expect(resultUint16).toStrictEqual(serializedViewUint16);
            expect(resultInt8).toStrictEqual(serializedViewInt8);
            expect(resultBigInt64).toStrictEqual(serializedViewBigInt64);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize an array buffer', async () =>
        {
            const resultUint16 = await serializer.deserialize(serializedViewUint16);
            const resultInt8 = await serializer.deserialize(serializedViewInt8);
            const resultBigInt64 = await serializer.deserialize(serializedViewBigInt64);

            expect(resultUint16).toStrictEqual(viewUint16);
            expect(resultInt8).toStrictEqual(viewInt8);
            expect(resultBigInt64).toStrictEqual(viewBigInt64);
        });
    });
});
