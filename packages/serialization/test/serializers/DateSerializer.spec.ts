
import { describe, expect, it } from 'vitest';

import DateSerializer from '../../src/serializers/DateSerializer';
import InvalidDateString from '../../src/serializers/errors/InvalidDateString';

import
    {
        fixedDate,
        serializedFixedDate,
        nonObject, nonDate, notSerialized, invalidName, invalidDateValue, invalidDateString
    } from '../_fixtures/serializers/DateSerializer.fixture';

const serializer = new DateSerializer();

describe('serializers/DateSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a date', () =>
        {
            const supportsDate = serializer.canSerialize(fixedDate);

            expect(supportsDate).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonDate = serializer.canSerialize(nonDate);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonDate).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a date', () =>
        {
            const supportsDate = serializer.canDeserialize(serializedFixedDate);

            expect(supportsDate).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsInvalidName = serializer.canDeserialize(invalidName);
            const supportsInvalidDateValue = serializer.canDeserialize(invalidDateValue);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidDateValue).toBeFalsy();
        });
    });

    describe('.serialize(date)', () =>
    {
        it('should serialize a date', async () =>
        {
            const resultFixedDate = await serializer.serialize(fixedDate);

            expect(resultFixedDate).toStrictEqual(serializedFixedDate);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a date', async () =>
        {
            const resultFixedDate = await serializer.deserialize(serializedFixedDate);

            expect(resultFixedDate).toStrictEqual(fixedDate);
        });

        it('should not deserialize a date with an invalid date string', async () =>
        {
            const deserialize = async () => serializer.deserialize(invalidDateString);

            expect(deserialize).rejects.toStrictEqual(new InvalidDateString('hello'));
        });
    });
});
