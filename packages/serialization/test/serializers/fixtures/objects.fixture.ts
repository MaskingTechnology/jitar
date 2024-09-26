
const emptyObject = {};
const mixedObject = { a: 1, b: true, c: 'hello' };
const nestedObject = { a: 1, b: true, c: { d: false, e: true } };

const nonObject = 42;
const specificObject = new Map();

export const OBJECTS =
{
    EMPTY: emptyObject,
    MIXED: mixedObject,
    NESTED: nestedObject,
    NON_OBJECT: nonObject,
    SPECIFIC_OBJECT: specificObject
};
