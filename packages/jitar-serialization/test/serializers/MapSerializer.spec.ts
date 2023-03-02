
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

            expect(supportsMap).toBe(true);
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonMap = serializer.canSerialize(nonMap);

            expect(supportsNonObject).toBe(false);
            expect(supportsNonMap).toBe(false);
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a map', () =>
        {
            const supportsMap = serializer.canDeserialize(serializedEmptyMap);

            expect(supportsMap).toBe(true);
        });

        it('should tell it can not deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsinvalidName = serializer.canDeserialize(invalidName);
            const supportsinvalidKeys = serializer.canDeserialize(invalidKeys);
            const supportsinvalidValues = serializer.canDeserialize(invalidValues);

            expect(supportsNonObject).toBe(false);
            expect(supportsNotSerialized).toBe(false);
            expect(supportsinvalidName).toBe(false);
            expect(supportsinvalidKeys).toBe(false);
            expect(supportsinvalidValues).toBe(false);
        });
    });

    describe('.serialize(data)', () =>
    {
        it('should serialize a map', async () =>
        {
            const resultEmptyMap = await serializer.serialize(emptyMap);
            const resultMixedMap = await serializer.serialize(mixedMap);
            const resultNestedMap = await serializer.serialize(nestedMap);

            expect(resultEmptyMap).toEqual(serializedEmptyMap);
            expect(resultMixedMap).toEqual(serializedMixedMap);
            expect(resultNestedMap).toEqual(serializedNestedMap);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a map', async () =>
        {
            const resultEmptyMap = await serializer.deserialize(serializedEmptyMap);
            const resultMixedMap = await serializer.deserialize(serializedMixedMap);
            const resultNestedMap = await serializer.deserialize(serializedNestedMap);

            expect(resultEmptyMap).toEqual(emptyMap);
            expect(resultMixedMap).toEqual(mixedMap);
            expect(resultNestedMap).toEqual(nestedMap);
        });
    });
});
