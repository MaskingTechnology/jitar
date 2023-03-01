
const fixedDate = new Date('2021-01-01T00:00:00.000Z');

const serializedFixedDate = { serialized: true, name: 'Date', value: '2021-01-01T00:00:00.000Z' };
const serializedInvalidDateValue = { serialized: true, name: 'Date', value: true };
const serializedInvalidDateString = { serialized: true, name: 'Date', value: 'hello' };

export {
    fixedDate,
    serializedFixedDate, serializedInvalidDateValue, serializedInvalidDateString
}
