
import { describe, expect, it } from 'vitest';

import RegExpSerializer from '../../src/serializers/RegExpSerializer';
import InvalidRegExp from '../../src/serializers/errors/InvalidRegExp';

import
{
    validRegExp,
    serializedValidRegExp,
    nonObject, nonRegExp, notSerialized, invalidName, invalidRegExpSource, invalidRegExpFlag,
    serializedInvalidRegExpSource, serializedInvalidRegExpFlag
} from '../_fixtures/serializers/RegExpSerializer.fixture';

const serializer = new RegExpSerializer();

describe('serializers/RegExpSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize an regular expression', () =>
        {
            const supportsRegExp = serializer.canSerialize(validRegExp);

            expect(supportsRegExp).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonRegExp = serializer.canSerialize(nonRegExp);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonRegExp).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize an regular expression', () =>
        {
            const supportsRegExp = serializer.canDeserialize(serializedValidRegExp);

            expect(supportsRegExp).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsInvalidName = serializer.canDeserialize(invalidName);
            const supportsInvalidSourceString = serializer.canDeserialize(invalidRegExpSource);
            const supportsInvalidFlagString = serializer.canDeserialize(invalidRegExpFlag);

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
            const resultValidRegExp = await serializer.serialize(validRegExp);

            expect(resultValidRegExp).toStrictEqual(serializedValidRegExp);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a regular expression', async () =>
        {
            const resultValidRegExp = await serializer.deserialize(serializedValidRegExp);

            expect(resultValidRegExp).toStrictEqual(validRegExp);
        });

        it('should not deserialize a regular expression with invalid source', async () =>
        {
            const deserialize = async () => serializer.deserialize(serializedInvalidRegExpSource);

            expect(deserialize).rejects.toStrictEqual(new InvalidRegExp('sel/\\', 'g'));
        });

        it('should not deserialize a regular expression with invalid flag', async () =>
        {
            const deserialize = async () => serializer.deserialize(serializedInvalidRegExpFlag);

            expect(deserialize).rejects.toStrictEqual(new InvalidRegExp('w+', true));
        });
    });
});
