
const validRegExp = new RegExp('w+', 'gi');

const serializedValidRegExp = { serialized: true, name: 'RegExp', source: 'w+', flags: 'gi' };

const nonObject = 42;
const nonRegExp = new Map();
const notSerialized = { name: 'RegExp', source: 'w+', flags: 'gi' };
const invalidName = { serialized: true, name: 'Map', source: 'w+', flags: 'gi' };
const invalidRegExpSource = { serialized: true, name: 'Date', source: true, flags: 'g' };
const invalidRegExpFlag = { serialized: true, name: 'Date', source: 'w+', flags: true };
const serializedInvalidRegExpSource = { serialized: true, name: 'Date', source: 'sel/\\', flags: 'g' };
const serializedInvalidRegExpFlag = { serialized: true, name: 'Date', source: 'w+', flags: 'true' };

export
{
    validRegExp,
    serializedValidRegExp,
    nonObject, nonRegExp, notSerialized, invalidName, invalidRegExpSource, invalidRegExpFlag,
    serializedInvalidRegExpSource, SerializedInvalidRegExpFlag
};
