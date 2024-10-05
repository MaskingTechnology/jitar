
import ValueSerializer from '../ValueSerializer';
import SerializedBigInt from '../types/serialized/SerializedBigInt';
import InvalidBigIntString from './errors/InvalidBigIntString';

export default class BigIntSerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return typeof value === 'bigint';
    }

    canDeserialize(value: unknown): boolean
    {
        const bigInt = value as SerializedBigInt;

        return bigInt instanceof Object
            && bigInt.serialized === true
            && bigInt.name === 'BigInt'
            && typeof bigInt.value === 'string';
    }

    async serialize(bigInt: bigint): Promise<SerializedBigInt>
    {
        return { serialized: true, name: 'BigInt', value: bigInt.toString() };
    }

    async deserialize(object: SerializedBigInt): Promise<bigint>
    {
        try
        {
            return BigInt(object.value);
        }
        catch (error)
        {
            throw new InvalidBigIntString(object.value);
        }
    }
}
