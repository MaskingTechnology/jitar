
import { describe, expect, it } from 'vitest';

import MapSerializer from '../../src/serializers/MapSerializer';

import {
    parent,
    emptyMap, mixedMap, nestedMap,
    serializedEmptyMap, serializedMixedMap, serializedNestedMap,
    nonObject, nonMap, notSerialized, invalidName, invalidKeys, invalidValues
} from '../_fixtures/serializers/MapSerializer.fixture';

const serializer = new MapSerializer();
serializer.parent = parent;

describe('serializers/MapSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a map', () =>
        {
            const supportsMap = serializer.canSerialize(emptyMap);

            expect(supportsMap).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonMap = serializer.canSerialize(nonMap);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonMap).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a map', () =>
        {
            const supportsMap = serializer.canDeserialize(serializedEmptyMap);

            expect(supportsMap).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsInvalidName = serializer.canDeserialize(invalidName);
            const supportsInvalidKeys = serializer.canDeserialize(invalidKeys);
            const supportsInvalidValues = serializer.canDeserialize(invalidValues);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidKeys).toBeFalsy();
            expect(supportsInvalidValues).toBeFalsy();
        });
    });

    describe('.serialize(map)', () =>
    {
        it('should serialize a map', async () =>
        {
            const resultEmptyMap = await serializer.serialize(emptyMap);
            const resultMixedMap = await serializer.serialize(mixedMap);
            const resultNestedMap = await serializer.serialize(nestedMap);

            expect(resultEmptyMap).toStrictEqual(serializedEmptyMap);
            expect(resultMixedMap).toStrictEqual(serializedMixedMap);
            expect(resultNestedMap).toStrictEqual(serializedNestedMap);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a map', async () =>
        {
            const resultEmptyMap = await serializer.deserialize(serializedEmptyMap);
            const resultMixedMap = await serializer.deserialize(serializedMixedMap);
            const resultNestedMap = await serializer.deserialize(serializedNestedMap);

            expect(resultEmptyMap).toStrictEqual(emptyMap);
            expect(resultMixedMap).toStrictEqual(mixedMap);
            expect(resultNestedMap).toStrictEqual(nestedMap);
        });
    });
});
