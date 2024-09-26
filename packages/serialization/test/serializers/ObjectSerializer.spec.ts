
import { describe, expect, it } from 'vitest';

import Serializer from '../../src/Serializer';
import PrimitiveSerializer from '../../src/serializers/PrimitiveSerializer';
import ObjectSerializer from '../../src/serializers/ObjectSerializer';

import { OBJECTS } from './fixtures';

const serializer = new ObjectSerializer();
const parent = new Serializer();

parent.addSerializer(serializer);
parent.addSerializer(new PrimitiveSerializer());

describe('serializers/ObjectSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an object', () =>
        {
            const supportsObject = serializer.canSerialize(OBJECTS.EMPTY);

            expect(supportsObject).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(OBJECTS.NON_OBJECT);
            const supportsSpecificObject = serializer.canSerialize(OBJECTS.SPECIFIC_OBJECT);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsSpecificObject).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an object', () =>
        {
            const supportsObject = serializer.canDeserialize(OBJECTS.EMPTY);

            expect(supportsObject).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(OBJECTS.NON_OBJECT);
            const supportsSpecificObject = serializer.canDeserialize(OBJECTS.SPECIFIC_OBJECT);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsSpecificObject).toBeFalsy();
        });
    });

    describe('.serialize(object)', () =>
    {
        it('should serialize an object', async () =>
        {
            const resultEmptyObject = await serializer.serialize(OBJECTS.EMPTY);
            const resultMixedObject = await serializer.serialize(OBJECTS.MIXED);
            const resultNestedObject = await serializer.serialize(OBJECTS.NESTED);

            expect(resultEmptyObject).toStrictEqual(OBJECTS.EMPTY);
            expect(resultMixedObject).toStrictEqual(OBJECTS.MIXED);
            expect(resultNestedObject).toStrictEqual(OBJECTS.NESTED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize an object', async () =>
        {
            const resultEmptyObject = await serializer.deserialize(OBJECTS.EMPTY);
            const resultMixedObject = await serializer.deserialize(OBJECTS.MIXED);
            const resultNestedObject = await serializer.deserialize(OBJECTS.NESTED);

            expect(resultEmptyObject).toStrictEqual(OBJECTS.EMPTY);
            expect(resultMixedObject).toStrictEqual(OBJECTS.MIXED);
            expect(resultNestedObject).toStrictEqual(OBJECTS.NESTED);
        });
    });
});
