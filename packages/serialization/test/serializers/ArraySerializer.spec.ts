
import { describe, expect, it } from 'vitest';

import Serializer from '../../src/Serializer';
import PrimitiveSerializer from '../../src/serializers/PrimitiveSerializer';
import ArraySerializer from '../../src/serializers/ArraySerializer';

import { ARRAYS } from './fixtures';

const serializer = new ArraySerializer();
const parent = new Serializer();

parent.addSerializer(serializer);
parent.addSerializer(new PrimitiveSerializer());

describe('serializers/ArraySerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an array', () =>
        {
            const supportsArray = serializer.canSerialize(ARRAYS.EMPTY);

            expect(supportsArray).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(ARRAYS.NON_OBJECT);
            const supportsNonArray = serializer.canSerialize(ARRAYS.NON_ARRAY);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonArray).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an array', () =>
        {
            const supportsArray = serializer.canDeserialize(ARRAYS.EMPTY);

            expect(supportsArray).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(ARRAYS.NON_OBJECT);
            const supportsNonArray = serializer.canDeserialize(ARRAYS.NON_ARRAY);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonArray).toBeFalsy();
        });
    });

    describe('.serialize(array)', () =>
    {
        it('should serialize an array', async () =>
        {
            const resultEmptyArray = await serializer.serialize(ARRAYS.EMPTY);
            const resultMixedArray = await serializer.serialize(ARRAYS.MIXED);
            const resultNestedArray = await serializer.serialize(ARRAYS.NESTED);

            expect(resultEmptyArray).toStrictEqual(ARRAYS.EMPTY);
            expect(resultMixedArray).toStrictEqual(ARRAYS.MIXED);
            expect(resultNestedArray).toStrictEqual(ARRAYS.NESTED);
        });
    });

    describe('.deserialize(array)', () =>
    {
        it('should deserialize an array', async () =>
        {
            const resultEmptyArray = await serializer.deserialize(ARRAYS.EMPTY);
            const resultMixedArray = await serializer.deserialize(ARRAYS.MIXED);
            const resultNestedArray = await serializer.deserialize(ARRAYS.NESTED);

            expect(resultEmptyArray).toStrictEqual(ARRAYS.EMPTY);
            expect(resultMixedArray).toStrictEqual(ARRAYS.MIXED);
            expect(resultNestedArray).toStrictEqual(ARRAYS.NESTED);
        });
    });
});
