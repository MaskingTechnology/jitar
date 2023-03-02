
import { describe, expect, it } from 'vitest';

import PrimitiveSerializer from '../../src/serializers/PrimitiveSerializer';

import {
    numberValue, boolValue, stringValue, nullValue, undefinedValue, objectValue
} from '../_fixtures/serializers/PrimitiveSerializer.fixture';

const serializer = new PrimitiveSerializer();

describe('serializers/PrimitiveSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a primitive', () =>
        {
            const supportsNumber = serializer.canSerialize(numberValue);
            const supportsBool = serializer.canSerialize(boolValue);
            const supportsString = serializer.canSerialize(stringValue);
            const supportsNull = serializer.canSerialize(nullValue);
            const supportsUndefined = serializer.canSerialize(undefinedValue);

            expect(supportsNumber).toBe(true);
            expect(supportsBool).toBe(true);
            expect(supportsString).toBe(true);
            expect(supportsNull).toBe(true);
            expect(supportsUndefined).toBe(true);
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsObject = serializer.canSerialize(objectValue);

            expect(supportsObject).toBe(false);
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a primitive', () =>
        {
            const supportsNumber = serializer.canSerialize(numberValue);
            const supportsBool = serializer.canSerialize(boolValue);
            const supportsString = serializer.canSerialize(stringValue);
            const supportsNull = serializer.canSerialize(nullValue);
            const supportsUndefined = serializer.canSerialize(undefinedValue);

            expect(supportsNumber).toBe(true);
            expect(supportsBool).toBe(true);
            expect(supportsString).toBe(true);
            expect(supportsNull).toBe(true);
            expect(supportsUndefined).toBe(true);
        });

        it('should tell it can not deserialize others', () =>
        {
            const supportsObject = serializer.canSerialize(objectValue);

            expect(supportsObject).toBe(false);
        });
    });

    describe('.serialize(data)', () =>
    {
        it('should serialize a primitive', async () =>
        {
            const serializedNumber = await serializer.serialize(numberValue);
            const serializedBool = await serializer.serialize(boolValue);
            const serializedString = await serializer.serialize(stringValue);
            const serializedNull = await serializer.serialize(nullValue);
            const serializedUndefined = await serializer.serialize(undefinedValue);

            expect(serializedNumber).toBe(numberValue);
            expect(serializedBool).toBe(boolValue);
            expect(serializedString).toBe(stringValue);
            expect(serializedNull).toBe(nullValue);
            expect(serializedUndefined).toBe(undefinedValue);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a primitive', async () =>
        {
            const deserializedNumber = await serializer.deserialize(numberValue);
            const deserializedBool = await serializer.deserialize(boolValue);
            const deserializedString = await serializer.deserialize(stringValue);
            const deserializedNull = await serializer.deserialize(nullValue);
            const deserializedUndefined = await serializer.deserialize(undefinedValue);

            expect(deserializedNumber).toBe(numberValue);
            expect(deserializedBool).toBe(boolValue);
            expect(deserializedString).toBe(stringValue);
            expect(deserializedNull).toBe(nullValue);
            expect(deserializedUndefined).toBe(undefinedValue);
        });
    });
});
