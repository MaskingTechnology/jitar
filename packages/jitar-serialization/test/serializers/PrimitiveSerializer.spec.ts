
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

            expect(supportsNumber).toBeTruthy();
            expect(supportsBool).toBeTruthy();
            expect(supportsString).toBeTruthy();
            expect(supportsNull).toBeTruthy();
            expect(supportsUndefined).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsObject = serializer.canSerialize(objectValue);

            expect(supportsObject).toBeFalsy();
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

            expect(supportsNumber).toBeTruthy();
            expect(supportsBool).toBeTruthy();
            expect(supportsString).toBeTruthy();
            expect(supportsNull).toBeTruthy();
            expect(supportsUndefined).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsObject = serializer.canSerialize(objectValue);

            expect(supportsObject).toBeFalsy();
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

            expect(resultNumber).toEqual(numberValue);
            expect(resultBool).toEqual(boolValue);
            expect(resultString).toEqual(stringValue);
            expect(resultNull).toEqual(nullValue);
            expect(resultUndefined).toEqual(undefinedValue);
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

            expect(resultNumber).toEqual(numberValue);
            expect(resultBool).toEqual(boolValue);
            expect(resultString).toEqual(stringValue);
            expect(resultNull).toEqual(nullValue);
            expect(resultUndefined).toEqual(undefinedValue);
        });
    });
});
