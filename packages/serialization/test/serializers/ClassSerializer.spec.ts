
import { describe, expect, it } from 'vitest';

import ClassNotFound from '../../src/errors/ClassNotFound';
import InvalidClass from '../../src/errors/InvalidClass';

import Serializer from '../../src/Serializer';
import PrimitiveSerializer from '../../src/serializers/PrimitiveSerializer';
import ClassSerializer from '../../src/serializers/ClassSerializer';

import { CLASSES, classResolver } from './fixtures';

const serializer = new ClassSerializer(classResolver);
const parent = new Serializer();

parent.addSerializer(serializer);
parent.addSerializer(new PrimitiveSerializer());

describe('serializers/ClassSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a class instance', () =>
        {
            const supportsClass = serializer.canSerialize(CLASSES.DATA_INSTANCE);

            expect(supportsClass).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(CLASSES.NON_OBJECT);
            const supportsNonClassObject = serializer.canSerialize(CLASSES.NON_CLASS_OBJECT);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonClassObject).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a class instance', () =>
        {
            const supportsClass = serializer.canDeserialize(CLASSES.DATA_SERIALIZED);

            expect(supportsClass).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNotSerialized = serializer.canDeserialize(CLASSES.NOT_SERIALIZED);
            const supportsInvalidKey = serializer.canDeserialize(CLASSES.INVALID_KEY);
            const supportsInvalidArgs = serializer.canDeserialize(CLASSES.INVALID_ARGS);
            const supportsInvalidFields = serializer.canDeserialize(CLASSES.INVALID_FIELDS);

            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidKey).toBeFalsy();
            expect(supportsInvalidArgs).toBeFalsy();
            expect(supportsInvalidFields).toBeFalsy();
        });
    });

    describe('.serialize(object)', () =>
    {
        it('should serialize a class instance', async () =>
        {
            const resultDataClass = await serializer.serialize(CLASSES.DATA_INSTANCE);
            const resultConstructedClass = await serializer.serialize(CLASSES.CONSTRUCTED_INSTANCE);
            const resultNestedClass = await serializer.serialize(CLASSES.NESTED_INSTANCE);

            expect(resultDataClass).toStrictEqual(CLASSES.DATA_SERIALIZED);
            expect(resultConstructedClass).toStrictEqual(CLASSES.CONSTRUCTED_SERIALIZED);
            expect(resultNestedClass).toStrictEqual(CLASSES.NESTED_SERIALIZED);
        });

        it('should not serialize set or get only variables', async () =>
        {
            const resultPrivateClass = await serializer.serialize(CLASSES.PRIVATE_INSTANCE);

            expect(resultPrivateClass).toStrictEqual(CLASSES.PRIVATE_SERIALIZED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a class instance', async () =>
        {
            const resultDataClass = await serializer.deserialize(CLASSES.DATA_SERIALIZED);
            const resultConstructedClass = await serializer.deserialize(CLASSES.CONSTRUCTED_SERIALIZED);
            const resultNestedClass = await serializer.deserialize(CLASSES.NESTED_SERIALIZED);

            expect(resultDataClass).toStrictEqual(CLASSES.DATA_INSTANCE);
            expect(resultConstructedClass).toStrictEqual(CLASSES.CONSTRUCTED_INSTANCE);
            expect(resultNestedClass).toStrictEqual(CLASSES.NESTED_INSTANCE);
        });

        it('should not deserialize invalid objects', async () =>
        {
            const deserialize = async () => serializer.deserialize(CLASSES.INVALID_SERIALIZED);

            expect(deserialize).rejects.toStrictEqual(new ClassNotFound('Invalid'));
        });

        it('should not deserialize non-function instances', async () =>
        {
            const deserialize = async () => serializer.deserialize(CLASSES.UNSERIALIZABLE);

            expect(deserialize).rejects.toStrictEqual(new InvalidClass('Infinity'));
        });
    });
});
