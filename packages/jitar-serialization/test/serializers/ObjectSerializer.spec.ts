
import { describe, expect, it } from 'vitest';

import ObjectSerializer from '../../src/serializers/ObjectSerializer';

import {
    parent,
    emptyObject, mixedObject, nestedObject,
    nonObject, specificObject
} from '../_fixtures/serializers/ObjectSerializer.fixture';

const serializer = new ObjectSerializer();
serializer.parent = parent;

describe('serializers/ObjectSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an object', () =>
        {
            const supportsObject = serializer.canSerialize(emptyObject);

            expect(supportsObject).toBe(true);
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsSpecificObject = serializer.canSerialize(specificObject);

            expect(supportsNonObject).toBe(false);
            expect(supportsSpecificObject).toBe(false);
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an object', () =>
        {
            const supportsObject = serializer.canDeserialize(emptyObject);

            expect(supportsObject).toBe(true);
        });

        it('should tell it can not deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsSpecificObject = serializer.canDeserialize(specificObject);

            expect(supportsNonObject).toBe(false);
            expect(supportsSpecificObject).toBe(false);
        });
    });

    describe('.serialize(object)', () =>
    {
        it('should serialize an object', async () =>
        {
            const resultEmptyObject = await serializer.serialize(emptyObject);
            const resultMixedObject = await serializer.serialize(mixedObject);
            const resultNestedObject = await serializer.serialize(nestedObject);

            expect(resultEmptyObject).toEqual(emptyObject);
            expect(resultMixedObject).toEqual(mixedObject);
            expect(resultNestedObject).toEqual(nestedObject);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize an object', async () =>
        {
            const resultEmptyObject = await serializer.deserialize(emptyObject);
            const resultMixedObject = await serializer.deserialize(mixedObject);
            const resultNestedObject = await serializer.deserialize(nestedObject);

            expect(resultEmptyObject).toEqual(emptyObject);
            expect(resultMixedObject).toEqual(mixedObject);
            expect(resultNestedObject).toEqual(nestedObject);
        });
    });
});
