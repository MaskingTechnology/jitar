
const Operator =
{
    ADD: '+',
    ARROW: '=>',

    ASSIGN: '=',
    ASSIGN_ADD: '+=',
    ASSIGN_BITWISE_AND: '&=',
    ASSIGN_BITWISE_OR: '|=',
    ASSIGN_BITWISE_XOR: '^=',
    ASSIGN_DIVIDE: '/=',
    ASSIGN_EXPONENTIAL: '**=',
    ASSIGN_LEFT_SHIFT: '<<=',
    ASSIGN_LOGICAL_AND: '&&=',
    ASSIGN_LOGICAL_OR: '||=',
    ASSIGN_REMAINDER: '%=',
    ASSIGN_MULTIPLY: '*=',
    ASSIGN_NULLISH: '??=',
    ASSIGN_RIGHT_SHIFT: '>>=',
    ASSIGN_SUBTRACT: '-=',
    BITWISE_AND: '&',
    BITWISE_OR: '|',
    BITWISE_NOT: '~',
    BITWISE_XOR: '^',
    DECREMENT: '--',
    DIVIDE: '/',
    EQUAL: '==',
    EQUAL_STRICT: '===',
    EXPONENTIAL: '**',
    GREATER: '>',
    GREATER_EQUAL: '>=',
    INCREMENT: '++',
    LEFT_SHIFT: '<<',
    LESS: '<',
    LESS_EQUAL: '<=',
    LOGICAL_AND: '&&',
    LOGICAL_OR: '||',
    REMAINDER: '%',
    MULTIPLY: '*',
    NULLISH: '??',
    CHAINING: '.',
    STUPID: '..',
    OPTIONAL_CHAINING: '?.',
    SPREAD: '...',
    NOT: '!',
    NOT_EQUAL: '!=',
    NOT_EQUAL_STRICT: '!==',
    RIGHT_SHIFT: '>>',
    SUBTRACT: '-',
    TERNARY: '?',
    XOR: '^'
};

const Operators = Object.values(Operator);

function isOperator(value: string): boolean
{
    return Operators.includes(value);
}

export { Operator, isOperator };
