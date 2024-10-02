
import { describe, expect, it } from 'vitest';

import Serializer from '../../src/Serializer';
import PrimitiveSerializer from '../../src/serializers/PrimitiveSerializer';
import SetSerializer from '../../src/serializers/SetSerializer';

import { SETS } from './fixtures';

const serializer = new SetSerializer();
const parent = new Serializer();

parent.addSerializer(serializer);
parent.addSerializer(new PrimitiveSerializer());

describe('serializers/SetSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a set', () =>
        {
            const supportsSet = serializer.canSerialize(SETS.EMPTY);

            expect(supportsSet).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(SETS.NON_OBJECT);
            const supportsNonSet = serializer.canSerialize(SETS.NON_SET);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonSet).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a set', () =>
        {
            const supportsSet = serializer.canDeserialize(SETS.EMPTY_SERIALIZED);

            expect(supportsSet).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(SETS.NON_OBJECT);
            const supportsNotSerialized = serializer.canDeserialize(SETS.NOT_SERIALIZED);
            const supportsInvalidName = serializer.canDeserialize(SETS.INVALID_NAME);
            const supportsInvalidValues = serializer.canDeserialize(SETS.INVALID_VALUES);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidValues).toBeFalsy();
        });
    });

    describe('.serialize(set)', () =>
    {
        it('should serialize a set', async () =>
        {
            const resultEmptySet = await serializer.serialize(SETS.EMPTY);
            const resultMixedSet = await serializer.serialize(SETS.MIXED);
            const resultNestedSet = await serializer.serialize(SETS.NESTED);

            expect(resultEmptySet).toStrictEqual(SETS.EMPTY_SERIALIZED);
            expect(resultMixedSet).toStrictEqual(SETS.MIXED_SERIALIZED);
            expect(resultNestedSet).toStrictEqual(SETS.NESTED_SERIALIZED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a set', async () =>
        {
            const resultEmptySet = await serializer.deserialize(SETS.EMPTY_SERIALIZED);
            const resultMixedSet = await serializer.deserialize(SETS.MIXED_SERIALIZED);
            const resultNestedSet = await serializer.deserialize(SETS.NESTED_SERIALIZED);

            expect(resultEmptySet).toStrictEqual(SETS.EMPTY);
            expect(resultMixedSet).toStrictEqual(SETS.MIXED);
            expect(resultNestedSet).toStrictEqual(SETS.NESTED);
        });
    });
});
