
const VALID_BASE64_DATA = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEElEQVR42mL8//8/AyUYIIgB';
const INVALID_BASE64_DATA = `##${VALID_BASE64_DATA}??`;

const validBuffer = Buffer.from(VALID_BASE64_DATA, 'base64');

const serializedValidBuffer = { serialized: true, name: 'Buffer', base64: VALID_BASE64_DATA };

const nonObject = 42;
const nonBuffer = new Map();
const notSerialized = { name: 'Buffer', base64: '' };
const invalidName = { serialized: true, name: 'Map', base64: VALID_BASE64_DATA };
const invalidBufferValue = { serialized: true, name: 'Buffer', base64: true };
const invalidBufferString = { serialized: true, name: 'Buffer', base64: INVALID_BASE64_DATA };

export const BUFFERS =
{
    VALID: validBuffer,
    VALID_SERIALIZED: serializedValidBuffer,
    NON_OBJECT: nonObject,
    NON_BUFFER: nonBuffer,
    NOT_SERIALIZED: notSerialized,
    INVALID_NAME: invalidName,
    INVALID_BUFFER_VALUE: invalidBufferValue,
    INVALID_BUFFER_STRING: invalidBufferString
};
