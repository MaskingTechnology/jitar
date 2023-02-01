
const Operator =
{
    PLUS: '+',
    MINUS: '-',
    DIVIDE: '/',
    MULTIPLY: '*',
    EQUAL: '=',
    LESS: '<',
    GREATER: '>',
    OR: '|',
    AND: '&',
    NOT: '!',
    ASSIGN: '=',
    MODULO: '%',
    TERNARY: '?',
    COLON: ':',
};

const Operators = Object.values(Operator);

function isOperator(value: string): boolean
{
    return Operators.includes(value);
}

export { Operator, Operators, isOperator };
