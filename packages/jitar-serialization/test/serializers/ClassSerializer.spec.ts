
import { describe, expect, it } from 'vitest';

import ClassNotFound from '../../src/errors/ClassNotFound';
import InvalidClass from '../../src/errors/InvalidClass';

import ClassSerializer from '../../src/serializers/ClassSerializer';

import {
    parent, classLoader,
    dataClass, constructedClass, nestedClass, privateClass,
    serializedDataClass, serializedConstructedClass, serializedNestedClass, serializedPrivateClass, serializedInvalidClass, serializedUnserializableClass,
    nonObject, nonClassObject, notSerialized, invalidName, invalidArgs, invalidFields
} from '../_fixtures/serializers/ClassSerializer.fixture';

const serializer = new ClassSerializer(classLoader);
serializer.parent = parent;

describe('serializers/ClassSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a class instance', () =>
        {
            const supportsClass = serializer.canSerialize(dataClass);

            expect(supportsClass).toBe(true);
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonClassObject = serializer.canSerialize(nonClassObject);
            
            expect(supportsNonObject).toBe(false);
            expect(supportsNonClassObject).toBe(false);
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a class instance', () =>
        {
            const supportsClass = serializer.canDeserialize(serializedDataClass);

            expect(supportsClass).toBe(true);
        });

        it('should tell it can not deserialize others', () =>
        {
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsInvalidName = serializer.canDeserialize(invalidName);
            const supportsInvalidArgs = serializer.canDeserialize(invalidArgs);
            const supportsInvalidFields = serializer.canDeserialize(invalidFields);

            expect(supportsNotSerialized).toBe(false);
            expect(supportsInvalidName).toBe(false);
            expect(supportsInvalidArgs).toBe(false);
            expect(supportsInvalidFields).toBe(false);
        });
    });

    describe('.serialize(data)', () =>
    {
        it('should serialize a class instance', async () =>
        {
            const resultDataClass = await serializer.serialize(dataClass);
            const resultConstructedClass = await serializer.serialize(constructedClass);
            const resultNestedClass = await serializer.serialize(nestedClass);

            expect(resultDataClass).toEqual(serializedDataClass);
            expect(resultConstructedClass).toEqual(serializedConstructedClass);
            expect(resultNestedClass).toEqual(serializedNestedClass);
        });

        it('should not serialize set or get only variables', async () =>
        {
            const resultPrivateClass = await serializer.serialize(privateClass);

            expect(resultPrivateClass).toEqual(serializedPrivateClass);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a class instance', async () =>
        {
            const resultDataClass = await serializer.deserialize(serializedDataClass);
            const resultConstructedClass = await serializer.deserialize(serializedConstructedClass);
            const resultNestedClass = await serializer.deserialize(serializedNestedClass);

            expect(resultDataClass).toEqual(dataClass);
            expect(resultConstructedClass).toEqual(constructedClass);
            expect(resultNestedClass).toEqual(nestedClass);
        });

        it('should not deserialize invalid objects', async () =>
        {
            const deserialize = async () => await serializer.deserialize(serializedInvalidClass);

            expect(deserialize).rejects.toEqual(new ClassNotFound('Invalid'));
        });

        it('should not deserialize non-function instances', async () =>
        {
            const deserialize = async () => await serializer.deserialize(serializedUnserializableClass);

            expect(deserialize).rejects.toEqual(new InvalidClass('Infinity'));
        });
    });
});
