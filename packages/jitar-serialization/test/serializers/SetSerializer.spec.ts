
import { describe, expect, it } from 'vitest';

import SetSerializer from '../../src/serializers/SetSerializer';

import {
    parent,
    emptySet, mixedSet, nestedSet,
    serializedEmptySet, serializedMixedSet, serializedNestedSet,
    nonObject, nonSet, notSerialized, invalidName, invalidValues
} from '../_fixtures/serializers/SetSerializer.fixture';

const serializer = new SetSerializer();
serializer.parent = parent;

describe('serializers/SetSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a set', () =>
        {
            const supportsSet = serializer.canSerialize(emptySet);

            expect(supportsSet).toBeTruthy();
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonSet = serializer.canSerialize(nonSet);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonSet).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a set', () =>
        {
            const supportsSet = serializer.canDeserialize(serializedEmptySet);

            expect(supportsSet).toBeTruthy();
        });

        it('should tell it can not deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsInvalidName = serializer.canDeserialize(invalidName);
            const supportsInvalidValues = serializer.canDeserialize(invalidValues);

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
            const resultEmptySet = await serializer.serialize(emptySet);
            const resultMixedSet = await serializer.serialize(mixedSet);
            const resultNestedSet = await serializer.serialize(nestedSet);

            expect(resultEmptySet).toStrictEqual(serializedEmptySet);
            expect(resultMixedSet).toStrictEqual(serializedMixedSet);
            expect(resultNestedSet).toStrictEqual(serializedNestedSet);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a set', async () =>
        {
            const resultEmptySet = await serializer.deserialize(serializedEmptySet);
            const resultMixedSet = await serializer.deserialize(serializedMixedSet);
            const resultNestedSet = await serializer.deserialize(serializedNestedSet);

            expect(resultEmptySet).toStrictEqual(emptySet);
            expect(resultMixedSet).toStrictEqual(mixedSet);
            expect(resultNestedSet).toStrictEqual(nestedSet);
        });
    });
});
