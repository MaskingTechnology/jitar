
const Operator =
{
    ADD: '+',
    ARROW: '=>',
    ASSIGN: '=',
    ASSIGN_ADD: '+=',
    ASSIGN_BITWISE_AND: '&=',
    ASSIGN_BITWISE_OR: '|=',
    ASSIGN_DIVIDE: '/=',
    ASSIGN_LEFT_SHIFT: '<<=',
    ASSIGN_LOGICAL_AND: '&&=',
    ASSIGN_LOGICAL_OR: '||=',
    ASSIGN_MODULO: '%=',
    ASSIGN_MULTIPLY: '*=',
    ASSIGN_RIGHT_SHIFT: '>>=',
    ASSIGN_SUBTRACT: '-=',
    ASSIGN_XOR: '^=',
    BITWISE_AND: '&',
    BITWISE_OR: '|',
    DECREMENT: '--',
    DIVIDE: '/',
    EQUAL: '==',
    EQUAL_STRICT: '===',
    GREATER: '>',
    GREATER_EQUAL: '>=',
    INCREMENT: '++',
    LEFT_SHIFT: '<<',
    LESS: '<',
    LESS_EQUAL: '<=',
    LOGICAL_AND: '&&',
    LOGICAL_OR: '||',
    MODULO: '%',
    MULTIPLY: '*',
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
