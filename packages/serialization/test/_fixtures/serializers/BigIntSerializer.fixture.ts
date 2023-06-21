
const validBigInt = BigInt('712481154548511564694316543156464654654654561');

const serializedValidBigInt = { serialized: true, name: 'BigInt', value: '712481154548511564694316543156464654654654561' };

const nonObject = 42;
const nonBigInt = new Map();
const notSerialized = { name: 'BigInt', value: '' };
const invalidName = { serialized: true, name: 'Map', value: '712481154548511564694316543156464654654654561' };
const invalidBigIntValue = { serialized: true, name: 'BigInt', value: true };
const invalidBigIntString = { serialized: true, name: 'BigInt', value: '1.3' };

export
{
    validBigInt,
    serializedValidBigInt,
    nonObject, nonBigInt, notSerialized, invalidName, invalidBigIntValue, invalidBigIntString
};
