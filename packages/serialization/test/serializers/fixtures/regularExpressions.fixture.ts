
const validRegExp = /\w+/gi;

const serializedValidRegExp = { serialized: true, name: 'RegExp', source: '\\w+', flags: 'gi' };

const nonObject = 42;
const nonRegExp = new Map();
const notSerialized = { name: 'RegExp', source: '\\w+', flags: 'gi' };
const invalidName = { serialized: true, name: 'Map', source: '\\w+', flags: 'gi' };
const invalidRegExpSource = { serialized: true, name: 'RegExp', source: true, flags: 'g' };
const invalidRegExpFlag = { serialized: true, name: 'RegExp', source: '\\w+', flags: true };
const serializedInvalidRegExpSource = { serialized: true, name: 'RegExp', source: 'sel/\\', flags: 'g' };
const serializedInvalidRegExpFlag = { serialized: true, name: 'RegExp', source: '\\w+', flags: 'true' };

export const REGULAR_EXPRESSIONS =
{
    VALID: validRegExp,
    VALID_SERIALIZED: serializedValidRegExp,
    NON_OBJECT: nonObject,
    NON_REGEXP: nonRegExp,
    NOT_SERIALIZED: notSerialized,
    INVALID_NAME: invalidName,
    INVALID_SOURCE: invalidRegExpSource,
    INVALID_FLAG: invalidRegExpFlag,
    INVALID_SOURCE_SERIALIZED: serializedInvalidRegExpSource,
    INVALID_FLAG_SERIALIZED: serializedInvalidRegExpFlag
};
