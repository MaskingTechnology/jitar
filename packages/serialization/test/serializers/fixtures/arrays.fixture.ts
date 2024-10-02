
const emptyArray: unknown[] = [];
const mixedArray: unknown[] = ['a', 1, true];
const nestedArray: unknown[] = ['b', 2, ['c', false], true];

const nonObject = 42;
const nonArray = new Map();

export const ARRAYS =
{
    EMPTY: emptyArray,
    MIXED: mixedArray,
    NESTED: nestedArray,
    NON_OBJECT: nonObject,
    NON_ARRAY: nonArray,
};
