
function createViewUint16(string: string)
{
    const buffer = new ArrayBuffer(string.length * 2);
    const view = new Uint16Array(buffer);

    for (let index = 0; index < string.length; index++)
    {
        view[index] = string.charCodeAt(index);
    }

    return view;
}

function createViewInt8(string: string)
{
    const buffer = new ArrayBuffer(string.length);
    const view = new Int8Array(buffer);

    for (let index = 0; index < string.length; index++)
    {
        view[index] = string.charCodeAt(index);
    }

    return view;
}

function createViewBigInt64(string: string)
{
    const buffer = new ArrayBuffer(string.length * 8);
    const view = new BigInt64Array(buffer);

    for (let index = 0; index < string.length; index++)
    {
        view[index] = BigInt(string.charCodeAt(index));
    }

    return view;
}

const viewUint16 = createViewUint16('jitar');
const viewInt8 = createViewInt8('jitar');
const viewBigInt64 = createViewBigInt64('jitar');

const serializedViewUint16 = { serialized: true, name: 'TypedArray', type: 'Uint16Array', bytes: [106, 0, 105, 0, 116, 0, 97, 0, 114, 0] };
const serializedViewInt8 = { serialized: true, name: 'TypedArray', type: 'Int8Array', bytes: [106, 105, 116, 97, 114] };
const serializedViewBigInt64 = { serialized: true, name: 'TypedArray', type: 'BigInt64Array', bytes: [106, 0, 0, 0, 0, 0, 0, 0, 105, 0, 0, 0, 0, 0, 0, 0, 116, 0, 0, 0, 0, 0, 0, 0, 97, 0, 0, 0, 0, 0, 0, 0, 114, 0, 0, 0, 0, 0, 0, 0] };

const nonObject = 42;
const plainObject = {};
const notSerialized = { name: 'TypedArray', type: 'Uint16Array', bytes: [] };
const invalidName = { serialized: true, name: 'OtherBuffer', type: 'Uint16Array', bytes: [] };
const invalidType = { serialized: true, name: 'TypedArray', type: 'Int42Array', bytes: [] };
const invalidBytes = { serialized: true, name: 'TypedArray', type: 'Uint16Array', bytes: {} };

export const TYPED_ARRAYS =
{
    UINT16: viewUint16,
    UINT16_SERIALIZED: serializedViewUint16,
    INT8: viewInt8,
    INT8_SERIALIZED: serializedViewInt8,
    BIG_INT64: viewBigInt64,
    BIG_INT64_SERIALIZED: serializedViewBigInt64,
    NON_OBJECT: nonObject,
    PLAIN_OBJECT: plainObject,
    NOT_SERIALIZED: notSerialized,
    INVALID_NAME: invalidName,
    INVALID_TYPE: invalidType,
    INVALID_BYTES: invalidBytes
};
