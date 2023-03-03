
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

            expect(supportsClass).toBeTruthy();
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonClassObject = serializer.canSerialize(nonClassObject);
            
            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonClassObject).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a class instance', () =>
        {
            const supportsClass = serializer.canDeserialize(serializedDataClass);

            expect(supportsClass).toBeTruthy();
        });

        it('should tell it can not deserialize others', () =>
        {
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsInvalidName = serializer.canDeserialize(invalidName);
            const supportsInvalidArgs = serializer.canDeserialize(invalidArgs);
            const supportsInvalidFields = serializer.canDeserialize(invalidFields);

            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidArgs).toBeFalsy();
            expect(supportsInvalidFields).toBeFalsy();
        });
    });

    describe('.serialize(object)', () =>
    {
        it('should serialize a class instance', async () =>
        {
            const resultDataClass = await serializer.serialize(dataClass);
            const resultConstructedClass = await serializer.serialize(constructedClass);
            const resultNestedClass = await serializer.serialize(nestedClass);

            expect(resultDataClass).toStrictEqual(serializedDataClass);
            expect(resultConstructedClass).toStrictEqual(serializedConstructedClass);
            expect(resultNestedClass).toStrictEqual(serializedNestedClass);
        });

        it('should not serialize set or get only variables', async () =>
        {
            const resultPrivateClass = await serializer.serialize(privateClass);

            expect(resultPrivateClass).toStrictEqual(serializedPrivateClass);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a class instance', async () =>
        {
            const resultDataClass = await serializer.deserialize(serializedDataClass);
            const resultConstructedClass = await serializer.deserialize(serializedConstructedClass);
            const resultNestedClass = await serializer.deserialize(serializedNestedClass);

            expect(resultDataClass).toStrictEqual(dataClass);
            expect(resultConstructedClass).toStrictEqual(constructedClass);
            expect(resultNestedClass).toStrictEqual(nestedClass);
        });

        it('should not deserialize invalid objects', async () =>
        {
            const deserialize = async () => await serializer.deserialize(serializedInvalidClass);

            expect(deserialize).rejects.toStrictEqual(new ClassNotFound('Invalid'));
        });

        it('should not deserialize non-function instances', async () =>
        {
            const deserialize = async () => await serializer.deserialize(serializedUnserializableClass);

            expect(deserialize).rejects.toStrictEqual(new InvalidClass('Infinity'));
        });
    });
});
