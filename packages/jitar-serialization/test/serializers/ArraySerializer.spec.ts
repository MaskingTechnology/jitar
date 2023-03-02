
import { describe, expect, it } from 'vitest';

import ArraySerializer from '../../src/serializers/ArraySerializer';

import {
    parent,
    emptyArray, mixedArray, nestedArray,
    nonObject, nonArray
} from '../_fixtures/serializers/ArraySerializer.fixture';

const serializer = new ArraySerializer();
serializer.parent = parent;

describe('serializers/ArraySerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an array', () =>
        {
            const supportsArray = serializer.canSerialize(emptyArray);

            expect(supportsArray).toBe(true);
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonArray = serializer.canSerialize(nonArray);

            expect(supportsNonObject).toBe(false);
            expect(supportsNonArray).toBe(false);
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an array', () =>
        {
            const supportsArray = serializer.canDeserialize(emptyArray);

            expect(supportsArray).toBe(true);
        });

        it('should tell it can not deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNonArray = serializer.canDeserialize(nonArray);

            expect(supportsNonObject).toBe(false);
            expect(supportsNonArray).toBe(false);
        });
    });

    describe('.serialize(array)', () =>
    {
        it('should serialize an array', async () =>
        {
            const resultEmptyArray = await serializer.serialize(emptyArray);
            const resultMixedArray = await serializer.serialize(mixedArray);
            const resultNestedArray = await serializer.serialize(nestedArray);

            expect(resultEmptyArray).toEqual(emptyArray);
            expect(resultMixedArray).toEqual(mixedArray);
            expect(resultNestedArray).toEqual(nestedArray);
        });
    });

    describe('.deserialize(array)', () =>
    {
        it('should deserialize an array', async () =>
        {
            const resultEmptyArray = await serializer.deserialize(emptyArray);
            const resultMixedArray = await serializer.deserialize(mixedArray);
            const resultNestedArray = await serializer.deserialize(nestedArray);

            expect(resultEmptyArray).toEqual(emptyArray);
            expect(resultMixedArray).toEqual(mixedArray);
            expect(resultNestedArray).toEqual(nestedArray);
        });
    });
});
