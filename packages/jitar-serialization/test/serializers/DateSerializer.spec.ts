
import { describe, expect, it } from 'vitest';

import DateSerializer from '../../src/serializers/DateSerializer';
import InvalidDateString from '../../src/serializers/errors/InvalidDateString';

import {
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

            expect(supportsDate).toBe(true);
        });

        it('should tell it can not serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonDate = serializer.canSerialize(nonDate);

            expect(supportsNonObject).toBe(false);
            expect(supportsNonDate).toBe(false);
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a date', () =>
        {
            const supportsDate = serializer.canDeserialize(serializedFixedDate);

            expect(supportsDate).toBe(true);
        });

        it('should tell it can not deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsinvalidName = serializer.canDeserialize(invalidName);
            const supportsinvalidDateValue = serializer.canDeserialize(invalidDateValue);

            expect(supportsNonObject).toBe(false);
            expect(supportsNotSerialized).toBe(false);
            expect(supportsinvalidName).toBe(false);
            expect(supportsinvalidDateValue).toBe(false);
        });
    });

    describe('.serialize(date)', () =>
    {
        it('should serialize a date', async () =>
        {
            const resultFixedDate = await serializer.serialize(fixedDate);

            expect(resultFixedDate).toEqual(serializedFixedDate);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a date', async () =>
        {
            const resultFixedDate = await serializer.deserialize(serializedFixedDate);

            expect(resultFixedDate).toEqual(fixedDate);
        });

        it('should not deserialize a date with an invalid date string', async () =>
        {
            const run = async () => await serializer.deserialize(invalidDateString);

            expect(run).rejects.toEqual(new InvalidDateString('hello'));
        });
    });
});
