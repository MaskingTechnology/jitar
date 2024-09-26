
class CustomError extends Error {}

const plainError = new Error('plain');
const evalError = new EvalError('eval');
const rangeError = new RangeError('range');
const referenceError = new ReferenceError('reference');
const syntaxError = new SyntaxError('syntax');
const typeError = new TypeError('type');
const uriError = new URIError('uri');

plainError.stack = undefined;
evalError.stack = undefined;
rangeError.stack = undefined;
referenceError.stack = undefined;
syntaxError.stack = undefined;
typeError.stack = undefined;
uriError.stack = undefined;

const serializedPlainError = { serialized: true, name: 'Error', type: 'Error', stack: undefined, message: 'plain', cause: undefined };
const serializedEvalError = { serialized: true, name: 'Error', type: 'EvalError', stack: undefined, message: 'eval', cause: undefined };
const serializedRangeError = { serialized: true, name: 'Error', type: 'RangeError', stack: undefined, message: 'range', cause: undefined };
const serializedReferenceError = { serialized: true, name: 'Error', type: 'ReferenceError', stack: undefined, message: 'reference', cause: undefined };
const serializedSyntaxError = { serialized: true, name: 'Error', type: 'SyntaxError', stack: undefined, message: 'syntax', cause: undefined };
const serializedTypeError = { serialized: true, name: 'Error', type: 'TypeError', stack: undefined, message: 'type', cause: undefined };
const serializedURIError = { serialized: true, name: 'Error', type: 'URIError', stack: undefined, message: 'uri', cause: undefined };

const customError = new CustomError('hello');
const otherClass = new Map();

const notSerialized = { name: 'Error', type: 'Error', stack: undefined, message: 'error', cause: undefined };
const invalidName = { serialized: true, name: 'CustomError', type: 'Error', stack: undefined, message: 'error', cause: undefined };
const invalidType = { serialized: true, name: 'Error', type: 'CustomError', stack: undefined, message: 'error', cause: undefined };

export const ERRORS =
{
    PLAIN: plainError,
    PLAIN_SERIALIZED: serializedPlainError,
    EVAL: evalError,
    EVAL_SERIALIZED: serializedEvalError,
    RANGE: rangeError,
    RANGE_SERIALIZED: serializedRangeError,
    REFERENCE: referenceError,
    REFERENCE_SERIALIZED: serializedReferenceError,
    SYNTAX: syntaxError,
    SYNTAX_SERIALIZED: serializedSyntaxError,
    TYPE: typeError,
    TYPE_SERIALIZED: serializedTypeError,
    URI: uriError,
    URI_SERIALIZED: serializedURIError,
    CUSTOM: customError,
    OTHER_CLASS: otherClass,
    NOT_SERIALIZED: notSerialized,
    INVALID_NAME: invalidName,
    INVALID_TYPE: invalidType
};
