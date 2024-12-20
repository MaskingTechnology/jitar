
import { describe, expect, it } from 'vitest';

import RegExpSerializer from '../../src/serializers/RegExpSerializer';
import InvalidRegExp from '../../src/serializers/errors/InvalidRegExp';

import { REGULAR_EXPRESSIONS } from './fixtures';

const serializer = new RegExpSerializer();

describe('serializers/RegExpSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an regular expression', () =>
        {
            const supportsRegExp = serializer.canSerialize(REGULAR_EXPRESSIONS.VALID);

            expect(supportsRegExp).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(REGULAR_EXPRESSIONS.NON_OBJECT);
            const supportsNonRegExp = serializer.canSerialize(REGULAR_EXPRESSIONS.NON_REGEXP);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonRegExp).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an regular expression', () =>
        {
            const supportsRegExp = serializer.canDeserialize(REGULAR_EXPRESSIONS.VALID_SERIALIZED);

            expect(supportsRegExp).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(REGULAR_EXPRESSIONS.NON_OBJECT);
            const supportsNotSerialized = serializer.canDeserialize(REGULAR_EXPRESSIONS.NOT_SERIALIZED);
            const supportsInvalidName = serializer.canDeserialize(REGULAR_EXPRESSIONS.INVALID_NAME);
            const supportsInvalidSourceString = serializer.canDeserialize(REGULAR_EXPRESSIONS.INVALID_SOURCE);
            const supportsInvalidFlagString = serializer.canDeserialize(REGULAR_EXPRESSIONS.INVALID_FLAG);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidSourceString).toBeFalsy();
            expect(supportsInvalidFlagString).toBeFalsy();
        });
    });

    describe('.serialize(regExp)', () =>
    {
        it('should serialize a regular expression', async () =>
        {
            const resultValidRegExp = await serializer.serialize(REGULAR_EXPRESSIONS.VALID);

            expect(resultValidRegExp).toStrictEqual(REGULAR_EXPRESSIONS.VALID_SERIALIZED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a regular expression', async () =>
        {
            const resultValidRegExp = await serializer.deserialize(REGULAR_EXPRESSIONS.VALID_SERIALIZED);

            expect(resultValidRegExp).toStrictEqual(REGULAR_EXPRESSIONS.VALID);
        });

        it('should not deserialize a regular expression with invalid source', async () =>
        {
            const deserialize = async () => serializer.deserialize(REGULAR_EXPRESSIONS.INVALID_SOURCE_SERIALIZED);

            await expect(deserialize).rejects.toStrictEqual(new InvalidRegExp('sel/\\', 'g'));
        });

        it('should not deserialize a regular expression with invalid flag', async () =>
        {
            const deserialize = async () => serializer.deserialize(REGULAR_EXPRESSIONS.INVALID_FLAG_SERIALIZED);

            await expect(deserialize).rejects.toStrictEqual(new InvalidRegExp('\\w+', true));
        });
    });
});
