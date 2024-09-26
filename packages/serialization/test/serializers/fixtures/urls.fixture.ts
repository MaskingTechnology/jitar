
const validUrl = new URL('https://example.com?foo=bar&baz=qux#quux');

const serializedValidUrl = { serialized: true, name: 'Url', value: 'https://example.com/?foo=bar&baz=qux#quux' };

const nonObject = 42;
const nonUrl = new Map();
const notSerialized = { name: 'Url', bytes: [] };
const invalidName = { serialized: true, name: 'Map', value: '2021-01-01T00:00:00.000Z' };
const invalidUrlValue = { serialized: true, name: 'Url', value: true };
const invalidUrlString = { serialized: true, name: 'Url', value: 'example' };

export const URLS =
{
    VALID: validUrl,
    VALID_SERIALIZED: serializedValidUrl,
    NON_OBJECT: nonObject,
    NON_URL: nonUrl,
    NOT_SERIALIZED: notSerialized,
    INVALID_NAME: invalidName,
    INVALID_URL_VALUE: invalidUrlValue,
    INVALID_URL_STRING: invalidUrlString
};
