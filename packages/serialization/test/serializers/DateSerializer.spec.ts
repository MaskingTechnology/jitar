
import { describe, expect, it } from 'vitest';

import DateSerializer from '../../src/serializers/DateSerializer';
import InvalidDateString from '../../src/serializers/errors/InvalidDateString';

import { DATES } from './fixtures';

const serializer = new DateSerializer();

describe('serializers/DateSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a date', () =>
        {
            const supportsDate = serializer.canSerialize(DATES.FIXED);

            expect(supportsDate).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(DATES.NON_OBJECT);
            const supportsNonDate = serializer.canSerialize(DATES.NON_DATE);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonDate).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a date', () =>
        {
            const supportsDate = serializer.canDeserialize(DATES.FIXED_SERIALIZED);

            expect(supportsDate).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(DATES.NON_OBJECT);
            const supportsNotSerialized = serializer.canDeserialize(DATES.NOT_SERIALIZED);
            const supportsInvalidName = serializer.canDeserialize(DATES.INVALID_NAME);
            const supportsInvalidDateValue = serializer.canDeserialize(DATES.INVALID_DATE_VALUE);

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
            const resultFixedDate = await serializer.serialize(DATES.FIXED);

            expect(resultFixedDate).toStrictEqual(DATES.FIXED_SERIALIZED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a date', async () =>
        {
            const resultFixedDate = await serializer.deserialize(DATES.FIXED_SERIALIZED);

            expect(resultFixedDate).toStrictEqual(DATES.FIXED);
        });

        it('should not deserialize a date with an invalid date string', async () =>
        {
            const deserialize = async () => serializer.deserialize(DATES.INVALID_DATE_STRING);

            await expect(deserialize).rejects.toStrictEqual(new InvalidDateString('hello'));
        });
    });
});
