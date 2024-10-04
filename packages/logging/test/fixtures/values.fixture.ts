
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
    DEBUG_CATEGORY: new RegExp('\\[DEBUG\\]\\[.*\\] debug'),
    INFO_CATEGORY: new RegExp('\\[INFO\\]\\[.*\\] info'),
    WARN_CATEGORY: new RegExp('\\[WARN\\]\\[.*\\] warn'),
    ERROR_CATEGORY: new RegExp('\\[ERROR\\]\\[.*\\] error'),
    FATAL_CATEGORY: new RegExp('\\[FATAL\\]\\[.*\\] fatal'),

    STRING: new RegExp('\\[.*\\]\\[.*\\] value'),
    NUMBER: new RegExp('\\[.*\\]\\[.*\\] 1'),
    BOOLEAN: new RegExp('\\[.*\\]\\[.*\\] true'),
    OBJECT: new RegExp('\\[.*\\]\\[.*\\] {"key":"value"}'),
    ARRAY: new RegExp('\\[.*\\]\\[.*\\] \\[\\n {2}value1,\\n {2}value2\\n\\]'),
    FUNCTION: new RegExp('\\[.*\\]\\[.*\\] function'),
    UNDEFINED: new RegExp('\\[.*\\]\\[.*\\] undefined'),
    NULL: new RegExp('\\[.*\\]\\[.*\\] null'),
    NESTED_OBJECT: new RegExp('\\[.*\\]\\[.*\\] {"key":{"key":{"key":"value"}}}'),
    NESTED_ARRAY: new RegExp('\\[.*\\]\\[.*\\] \\[\\n {2}value,\\n {2}\\[\\n {4}value,\\n {4}\\[\\n {6}value\\n {4}\\]\\n {2}\\]\\n\\]'),
    ERROR_WITH_STACKTRACE: new RegExp('\\[.*\\]\\[.*\\] Stacktrace'),
    ERROR_WITHOUT_STACKTRACE: new RegExp('\\[.*\\]\\[.*\\] error without stacktrace')
};
