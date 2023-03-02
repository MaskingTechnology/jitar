
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
            const resultNumber = await serializer.serialize(numberValue);
            const resultBool = await serializer.serialize(boolValue);
            const resultString = await serializer.serialize(stringValue);
            const resultNull = await serializer.serialize(nullValue);
            const resultUndefined = await serializer.serialize(undefinedValue);

            expect(resultNumber).toBe(numberValue);
            expect(resultBool).toBe(boolValue);
            expect(resultString).toBe(stringValue);
            expect(resultNull).toBe(nullValue);
            expect(resultUndefined).toBe(undefinedValue);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a primitive', async () =>
        {
            const resultNumber = await serializer.deserialize(numberValue);
            const resultBool = await serializer.deserialize(boolValue);
            const resultString = await serializer.deserialize(stringValue);
            const resultNull = await serializer.deserialize(nullValue);
            const resultUndefined = await serializer.deserialize(undefinedValue);

            expect(resultNumber).toBe(numberValue);
            expect(resultBool).toBe(boolValue);
            expect(resultString).toBe(stringValue);
            expect(resultNull).toBe(nullValue);
            expect(resultUndefined).toBe(undefinedValue);
        });
    });
});
