
import { describe, expect, it } from 'vitest';

import TemporalSerializer from '../../src/serializers/TemporalSerializer';
import InvalidTemporalString from '../../src/serializers/errors/InvalidTemporalString';
import InvalidTemporalType from '../../src/serializers/errors/InvalidTemporalType';

import { TEMPORALS } from './fixtures';

const serializer = new TemporalSerializer();

const PAIRS =
[
    [TEMPORALS.INSTANT, TEMPORALS.INSTANT_SERIALIZED],
    [TEMPORALS.ZONED_DATE_TIME, TEMPORALS.ZONED_DATE_TIME_SERIALIZED],
    [TEMPORALS.PLAIN_DATE_TIME, TEMPORALS.PLAIN_DATE_TIME_SERIALIZED],
    [TEMPORALS.PLAIN_DATE, TEMPORALS.PLAIN_DATE_SERIALIZED],
    [TEMPORALS.PLAIN_TIME, TEMPORALS.PLAIN_TIME_SERIALIZED],
    [TEMPORALS.PLAIN_YEAR_MONTH, TEMPORALS.PLAIN_YEAR_MONTH_SERIALIZED],
    [TEMPORALS.PLAIN_MONTH_DAY, TEMPORALS.PLAIN_MONTH_DAY_SERIALIZED],
    [TEMPORALS.DURATION, TEMPORALS.DURATION_SERIALIZED]
] as const;

describe.skipIf(TEMPORALS.SUPPORTED === false)('serializers/TemporalSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize all temporal types', () =>
        {
            for (const [temporal] of PAIRS)
            {
                const supportsTemporal = serializer.canSerialize(temporal);

                expect(supportsTemporal).toBeTruthy();
            }
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(TEMPORALS.NON_OBJECT);
            const supportsNonTemporal = serializer.canSerialize(TEMPORALS.NON_TEMPORAL);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonTemporal).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize all temporal types', () =>
        {
            for (const [, serialized] of PAIRS)
            {
                const supportsTemporal = serializer.canDeserialize(serialized);

                expect(supportsTemporal).toBeTruthy();
            }
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(TEMPORALS.NON_OBJECT);
            const supportsNotSerialized = serializer.canDeserialize(TEMPORALS.NOT_SERIALIZED);
            const supportsInvalidName = serializer.canDeserialize(TEMPORALS.INVALID_NAME);
            const supportsInvalidTypeValue = serializer.canDeserialize(TEMPORALS.INVALID_TYPE_VALUE);
            const supportsInvalidTemporalValue = serializer.canDeserialize(TEMPORALS.INVALID_TEMPORAL_VALUE);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidTypeValue).toBeFalsy();
            expect(supportsInvalidTemporalValue).toBeFalsy();
        });
    });

    describe('.serialize(temporal)', () =>
    {
        it('should serialize all temporal types', async () =>
        {
            for (const [temporal, serialized] of PAIRS)
            {
                const result = await serializer.serialize(temporal);

                expect(result).toStrictEqual(serialized);
            }
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize all temporal types', async () =>
        {
            for (const [temporal, serialized] of PAIRS)
            {
                const result = await serializer.deserialize(serialized);

                expect(result).toBeInstanceOf(temporal.constructor);
                expect(result.toString()).toBe(temporal.toString());
            }
        });

        it('should not deserialize an unknown temporal type', async () =>
        {
            const deserialize = async () => serializer.deserialize(TEMPORALS.UNKNOWN_TYPE);

            await expect(deserialize).rejects.toStrictEqual(new InvalidTemporalType('Calendar'));
        });

        it('should not deserialize a temporal with an invalid temporal string', async () =>
        {
            const deserialize = async () => serializer.deserialize(TEMPORALS.INVALID_TEMPORAL_STRING);

            await expect(deserialize).rejects.toStrictEqual(new InvalidTemporalString('PlainDate', 'hello'));
        });
    });
});
