
import { describe, expect, it } from 'vitest';

import BigIntSerializer from '../../src/serializers/BigIntSerializer';
import InvalidBigIntString from '../../src/serializers/errors/InvalidBigIntString';

import
{
    validBigInt,
    serializedValidBigInt,
    nonObject, nonBigInt, notSerialized, invalidName, invalidBigIntValue, invalidBigIntString
} from '../_fixtures/serializers/BigIntSerializer.fixture';

const serializer = new BigIntSerializer();

describe('serializers/BigIntSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a big int', () =>
        {
            const supportsBigInt = serializer.canSerialize(validBigInt);

            expect(supportsBigInt).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(nonObject);
            const supportsNonBigInt = serializer.canSerialize(nonBigInt);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonBigInt).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a big int', () =>
        {
            const supportsBigInt = serializer.canDeserialize(serializedValidBigInt);

            expect(supportsBigInt).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(nonObject);
            const supportsNotSerialized = serializer.canDeserialize(notSerialized);
            const supportsInvalidName = serializer.canDeserialize(invalidName);
            const supportsInvalidBigIntValue = serializer.canDeserialize(invalidBigIntValue);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNotSerialized).toBeFalsy();
            expect(supportsInvalidName).toBeFalsy();
            expect(supportsInvalidBigIntValue).toBeFalsy();
        });
    });

    describe('.serialize(bigInt)', () =>
    {
        it('should serialize a big int', async () =>
        {
            const resultValidBigInt = await serializer.serialize(validBigInt);

            expect(resultValidBigInt).toStrictEqual(serializedValidBigInt);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a big int', async () =>
        {
            const resultValidBigInt = await serializer.deserialize(serializedValidBigInt);

            expect(resultValidBigInt).toStrictEqual(validBigInt);
        });

        it('should not deserialize a big int with an invalid big int string', async () =>
        {
            const deserialize = async () => serializer.deserialize(invalidBigIntString);

            expect(deserialize).rejects.toStrictEqual(new InvalidBigIntString('1.3'));
        });
    });
});
