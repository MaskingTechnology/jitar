
const errorWithStacktrace = new Error('error with stacktrace');
errorWithStacktrace.stack = 'Stacktrace';

const errorWithoutStacktrace = new Error('error without stacktrace');
errorWithoutStacktrace.stack = undefined;

export const INPUT =
{
    STRING: 'value',
    NUMBER: 1,
    BOOLEAN: true,
    OBJECT: { key: 'value' },
    ARRAY: ['value1', 'value2'],
    FUNCTION: () => 'value',
    UNDEFINED: undefined,
    NULL: null,
    NESTED_OBJECT: { key: { key: { key: 'value'} } },
    NESTED_ARRAY: ['value', ['value', ['value']]],
    ERROR_WITH_STACKTRACE: errorWithStacktrace,
    ERROR_WITHOUT_STACKTRACE: errorWithoutStacktrace
};

export const OUTPUT =
{
    STRING: '[INFO] value',
    NUMBER: '[INFO] 1',
    BOOLEAN: '[INFO] true',
    OBJECT: '[INFO] {"key":"value"}',
    ARRAY: '[INFO] [\n  value1,\n  value2\n]',
    FUNCTION: '[INFO] function',
    UNDEFINED: '[INFO] undefined',
    NULL: '[INFO] null',
    NESTED_OBJECT: '[INFO] {"key":{"key":{"key":"value"}}}',
    NESTED_ARRAY: '[INFO] [\n  value,\n  [\n    value,\n    [\n      value\n    ]\n  ]\n]',
    ERROR_WITH_STACKTRACE: '[INFO] Stacktrace',
    ERROR_WITHOUT_STACKTRACE: '[INFO] error without stacktrace'
};
