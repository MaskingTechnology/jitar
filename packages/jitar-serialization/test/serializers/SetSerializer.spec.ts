
import { describe, expect, it } from 'vitest';

import SetSerializer from '../../src/serializers/SetSerializer';

import {
    parent,
    emptySet, mixedSet, nestedSet,
    serializedEmptySet, serializedMixedSet, serializedNestedSet,
    nonObject, nonSet, notSerialized, wrongName, wrongValues
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

            expect(supportsSet).toBe(true);
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonSet = serializer.canSerialize(nonSet);

            expect(supportsNonObject).toBe(false);
            expect(supportsNonSet).toBe(false);
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a set', () =>
        {
            const supportsSet = serializer.canDeserialize(serializedEmptySet);

            expect(supportsSet).toBe(true);
        });

        it('should tell it can not deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsWrongName = serializer.canDeserialize(wrongName);
            const supportsWrongValues = serializer.canDeserialize(wrongValues);

            expect(supportsNonObject).toBe(false);
            expect(supportsNotSerialized).toBe(false);
            expect(supportsWrongName).toBe(false);
            expect(supportsWrongValues).toBe(false);
        });
    });

    describe('.serialize(data)', () =>
    {
        it('should serialize a set', async () =>
        {
            const resultEmptySet = await serializer.serialize(emptySet);
            const resultMixedSet = await serializer.serialize(mixedSet);
            const resultNestedSet = await serializer.serialize(nestedSet);

            expect(resultEmptySet).toEqual(serializedEmptySet);
            expect(resultMixedSet).toEqual(serializedMixedSet);
            expect(resultNestedSet).toEqual(serializedNestedSet);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a set', async () =>
        {
            const resultEmptySet = await serializer.deserialize(serializedEmptySet);
            const resultMixedSet = await serializer.deserialize(serializedMixedSet);
            const resultNestedSet = await serializer.deserialize(serializedNestedSet);

            expect(resultEmptySet).toEqual(emptySet);
            expect(resultMixedSet).toEqual(mixedSet);
            expect(resultNestedSet).toEqual(nestedSet);
        });
    });
});
