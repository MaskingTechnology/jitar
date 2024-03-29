
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

            expect(supportsArray).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonArray = serializer.canSerialize(nonArray);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonArray).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an array', () =>
        {
            const supportsArray = serializer.canDeserialize(emptyArray);

            expect(supportsArray).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNonArray = serializer.canDeserialize(nonArray);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonArray).toBeFalsy();
        });
    });

    describe('.serialize(array)', () =>
    {
        it('should serialize an array', async () =>
        {
            const resultEmptyArray = await serializer.serialize(emptyArray);
            const resultMixedArray = await serializer.serialize(mixedArray);
            const resultNestedArray = await serializer.serialize(nestedArray);

            expect(resultEmptyArray).toStrictEqual(emptyArray);
            expect(resultMixedArray).toStrictEqual(mixedArray);
            expect(resultNestedArray).toStrictEqual(nestedArray);
        });
    });

    describe('.deserialize(array)', () =>
    {
        it('should deserialize an array', async () =>
        {
            const resultEmptyArray = await serializer.deserialize(emptyArray);
            const resultMixedArray = await serializer.deserialize(mixedArray);
            const resultNestedArray = await serializer.deserialize(nestedArray);

            expect(resultEmptyArray).toStrictEqual(emptyArray);
            expect(resultMixedArray).toStrictEqual(mixedArray);
            expect(resultNestedArray).toStrictEqual(nestedArray);
        });
    });
});
