
import { describe, expect, it } from 'vitest';

import Serializer from '../../src/Serializer';
import PrimitiveSerializer from '../../src/serializers/PrimitiveSerializer';
import MapSerializer from '../../src/serializers/MapSerializer';

import { MAPS } from './fixtures';

const serializer = new MapSerializer();
const parent = new Serializer();

parent.addSerializer(serializer);
parent.addSerializer(new PrimitiveSerializer());

describe('serializers/MapSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a map', () =>
        {
            const supportsMap = serializer.canSerialize(MAPS.EMPTY);

            expect(supportsMap).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(MAPS.NON_OBJECT);
            const supportsNonMap = serializer.canSerialize(MAPS.NON_MAP);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonMap).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a map', () =>
        {
            const supportsMap = serializer.canDeserialize(MAPS.EMPTY_SERIALIZED);

            expect(supportsMap).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(MAPS.NON_OBJECT);
            const supportsNotSerialized = serializer.canDeserialize(MAPS.NOT_SERIALIZED);
            const supportsInvalidName = serializer.canDeserialize(MAPS.INVALID_NAME);
            const supportsInvalidKeys = serializer.canDeserialize(MAPS.INVALID_KEYS);
            const supportsInvalidValues = serializer.canDeserialize(MAPS.INVALID_VALUES);

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
            const resultEmptyMap = await serializer.serialize(MAPS.EMPTY);
            const resultMixedMap = await serializer.serialize(MAPS.MIXED);
            const resultNestedMap = await serializer.serialize(MAPS.NESTED);

            expect(resultEmptyMap).toStrictEqual(MAPS.EMPTY_SERIALIZED);
            expect(resultMixedMap).toStrictEqual(MAPS.MIXED_SERIALIZED);
            expect(resultNestedMap).toStrictEqual(MAPS.NESTED_SERIALIZED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a map', async () =>
        {
            const resultEmptyMap = await serializer.deserialize(MAPS.EMPTY_SERIALIZED);
            const resultMixedMap = await serializer.deserialize(MAPS.MIXED_SERIALIZED);
            const resultNestedMap = await serializer.deserialize(MAPS.NESTED_SERIALIZED);

            expect(resultEmptyMap).toStrictEqual(MAPS.EMPTY);
            expect(resultMixedMap).toStrictEqual(MAPS.MIXED);
            expect(resultNestedMap).toStrictEqual(MAPS.NESTED);
        });
    });
});
