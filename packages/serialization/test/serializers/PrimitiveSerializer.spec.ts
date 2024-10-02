
import { describe, expect, it } from 'vitest';

import PrimitiveSerializer from '../../src/serializers/PrimitiveSerializer';

import { PRIMITIVES } from './fixtures';

const serializer = new PrimitiveSerializer();

describe('serializers/PrimitiveSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a primitive', () =>
        {
            const supportsNumber = serializer.canSerialize(PRIMITIVES.NUMBER);
            const supportsBool = serializer.canSerialize(PRIMITIVES.BOOL);
            const supportsString = serializer.canSerialize(PRIMITIVES.STRING);
            const supportsNull = serializer.canSerialize(PRIMITIVES.NULL);
            const supportsUndefined = serializer.canSerialize(PRIMITIVES.UNDEFINED);

            expect(supportsNumber).toBeTruthy();
            expect(supportsBool).toBeTruthy();
            expect(supportsString).toBeTruthy();
            expect(supportsNull).toBeTruthy();
            expect(supportsUndefined).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsObject = serializer.canSerialize(PRIMITIVES.OBJECT);

            expect(supportsObject).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a primitive', () =>
        {
            const supportsNumber = serializer.canSerialize(PRIMITIVES.NUMBER);
            const supportsBool = serializer.canSerialize(PRIMITIVES.BOOL);
            const supportsString = serializer.canSerialize(PRIMITIVES.STRING);
            const supportsNull = serializer.canSerialize(PRIMITIVES.NULL);
            const supportsUndefined = serializer.canSerialize(PRIMITIVES.UNDEFINED);

            expect(supportsNumber).toBeTruthy();
            expect(supportsBool).toBeTruthy();
            expect(supportsString).toBeTruthy();
            expect(supportsNull).toBeTruthy();
            expect(supportsUndefined).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsObject = serializer.canSerialize(PRIMITIVES.OBJECT);

            expect(supportsObject).toBeFalsy();
        });
    });

    describe('.serialize(data)', () =>
    {
        it('should serialize a primitive', async () =>
        {
            const resultNumber = await serializer.serialize(PRIMITIVES.NUMBER);
            const resultBool = await serializer.serialize(PRIMITIVES.BOOL);
            const resultString = await serializer.serialize(PRIMITIVES.STRING);
            const resultNull = await serializer.serialize(PRIMITIVES.NULL);
            const resultUndefined = await serializer.serialize(PRIMITIVES.UNDEFINED);

            expect(resultNumber).toEqual(PRIMITIVES.NUMBER);
            expect(resultBool).toEqual(PRIMITIVES.BOOL);
            expect(resultString).toEqual(PRIMITIVES.STRING);
            expect(resultNull).toEqual(PRIMITIVES.NULL);
            expect(resultUndefined).toEqual(PRIMITIVES.UNDEFINED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a primitive', async () =>
        {
            const resultNumber = await serializer.deserialize(PRIMITIVES.NUMBER);
            const resultBool = await serializer.deserialize(PRIMITIVES.BOOL);
            const resultString = await serializer.deserialize(PRIMITIVES.STRING);
            const resultNull = await serializer.deserialize(PRIMITIVES.NULL);
            const resultUndefined = await serializer.deserialize(PRIMITIVES.UNDEFINED);

            expect(resultNumber).toEqual(PRIMITIVES.NUMBER);
            expect(resultBool).toEqual(PRIMITIVES.BOOL);
            expect(resultString).toEqual(PRIMITIVES.STRING);
            expect(resultNull).toEqual(PRIMITIVES.NULL);
            expect(resultUndefined).toEqual(PRIMITIVES.UNDEFINED);
        });
    });
});
