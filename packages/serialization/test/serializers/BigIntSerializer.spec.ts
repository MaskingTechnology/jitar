
import { describe, expect, it } from 'vitest';

import BigIntSerializer from '../../src/serializers/BigIntSerializer';
import InvalidBigIntString from '../../src/serializers/errors/InvalidBigIntString';

import { BIG_INTEGERS } from './fixtures';

const serializer = new BigIntSerializer();

describe('serializers/BigIntSerializer', () =>
{
    describe('.canSerialize(value)', () =>
    {
        it('should tell it can serialize a big int', () =>
        {
            const supportsBigInt = serializer.canSerialize(BIG_INTEGERS.VALID);

            expect(supportsBigInt).toBeTruthy();
        });

        it('should tell it cannot serialize others', () =>
        {
            const supportsNonObject = serializer.canSerialize(BIG_INTEGERS.NON_OBJECT);
            const supportsNonBigInt = serializer.canSerialize(BIG_INTEGERS.NON_BIGINT);

            expect(supportsNonObject).toBeFalsy();
            expect(supportsNonBigInt).toBeFalsy();
        });
    });

    describe('.canDeserialize(value)', () =>
    {
        it('should tell it can deserialize a big int', () =>
        {
            const supportsBigInt = serializer.canDeserialize(BIG_INTEGERS.VALID_SERIALIZED);

            expect(supportsBigInt).toBeTruthy();
        });

        it('should tell it cannot deserialize others', () =>
        {
            const supportsNonObject = serializer.canDeserialize(BIG_INTEGERS.NON_OBJECT);
            const supportsNotSerialized = serializer.canDeserialize(BIG_INTEGERS.NOT_SERIALIZED);
            const supportsInvalidName = serializer.canDeserialize(BIG_INTEGERS.INVALID_NAME);
            const supportsInvalidBigIntValue = serializer.canDeserialize(BIG_INTEGERS.INVALID_BIGINT_VALUE);

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
            const resultValidBigInt = await serializer.serialize(BIG_INTEGERS.VALID);

            expect(resultValidBigInt).toStrictEqual(BIG_INTEGERS.VALID_SERIALIZED);
        });
    });

    describe('.deserialize(object)', () =>
    {
        it('should deserialize a big int', async () =>
        {
            const resultValidBigInt = await serializer.deserialize(BIG_INTEGERS.VALID_SERIALIZED);

            expect(resultValidBigInt).toStrictEqual(BIG_INTEGERS.VALID);
        });

        it('should not deserialize a big int with an invalid big int string', async () =>
        {
            const deserialize = async () => serializer.deserialize(BIG_INTEGERS.INVALID_BIGINT_STRING);

            expect(deserialize).rejects.toStrictEqual(new InvalidBigIntString('1.3'));
        });
    });
});
