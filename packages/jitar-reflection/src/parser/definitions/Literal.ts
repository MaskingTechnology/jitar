
const Literal =
{
    SINGLE: "'",
    DOUBLE: '"',
    BACKTICK: '`'
}

const Literals = Object.values(Literal);

function isLiteral(value: string): boolean
{
    return Literals.includes(value);
}

export { Literal, Literals, isLiteral };
