
const DATE_TIME_STRING = '2021-01-01T00:00:00.000Z';

const fixedDate = new Date(DATE_TIME_STRING);

const serializedFixedDate = { serialized: true, name: 'Date', value: DATE_TIME_STRING };

const nonObject = 42;
const nonDate = new Map();
const notSerialized = { name: 'Date', bytes: [] };
const invalidName = { serialized: true, name: 'Map', value: DATE_TIME_STRING };
const invalidDateValue = { serialized: true, name: 'Date', value: true };
const invalidDateString = { serialized: true, name: 'Date', value: 'hello' };

export {
    fixedDate,
    serializedFixedDate,
    nonObject, nonDate, notSerialized, invalidName, invalidDateValue, invalidDateString
};
