
const errorWithStacktrace = new Error('error with stacktrace');
errorWithStacktrace.stack = 'Stacktrace';

const errorWithoutStacktrace = new Error('error without stacktrace');
errorWithoutStacktrace.stack = undefined;

export const INPUT =
{
    DEBUG_CATEGORY: 'debug',
    INFO_CATEGORY: 'info',
    WARN_CATEGORY: 'warn',
    ERROR_CATEGORY: 'error',
    FATAL_CATEGORY: 'fatal',

    STRING: 'value',
    NUMBER: 1,
    BOOLEAN: true,
    OBJECT: { key: 'value' },
    ARRAY: ['value1', 'value2'],
    FUNCTION: () => 'value',
    UNDEFINED: undefined,
    NULL: null,
    NESTED_OBJECT: { key: { key: { key: 'value' } } },
    NESTED_ARRAY: ['value', ['value', ['value']]],
    ERROR_WITH_STACKTRACE: errorWithStacktrace,
    ERROR_WITHOUT_STACKTRACE: errorWithoutStacktrace
};

export const OUTPUT =
{
    DEBUG_CATEGORY: /\[DEBUG\]\[.*\] debug/,
    INFO_CATEGORY: /\[INFO\]\[.*\] info/,
    WARN_CATEGORY: /\[WARN\]\[.*\] warn/,
    ERROR_CATEGORY: /\[ERROR\]\[.*\] error/,
    FATAL_CATEGORY: /\[FATAL\]\[.*\] fatal/,

    STRING: /\[.*\]\[.*\] value/,
    NUMBER: /\[.*\]\[.*\] 1/,
    BOOLEAN: /\[.*\]\[.*\] true/,
    OBJECT: /\[.*\]\[.*\] {"key":"value"}/,
    ARRAY: /\[.*\]\[.*\] \[\n {2}value1,\n {2}value2\n\]/,
    FUNCTION: /\[.*\]\[.*\] function/,
    UNDEFINED: /\[.*\]\[.*\] undefined/,
    NULL: /\[.*\]\[.*\] null/,
    NESTED_OBJECT: /\[.*\]\[.*\] {"key":{"key":{"key":"value"}}}/,
    NESTED_ARRAY: /\[.*\]\[.*\] \[\n {2}value,\n {2}\[\n {4}value,\n {4}\[\n {6}value\n {4}\]\n {2}\]\n\]/,
    ERROR_WITH_STACKTRACE: /\[.*\]\[.*\] Stacktrace/,
    ERROR_WITHOUT_STACKTRACE: /\[.*\]\[.*\] error without stacktrace/
};
