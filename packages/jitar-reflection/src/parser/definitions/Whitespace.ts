
const Whitespace =
{
    SPACE: ' ',
    TAB: '\t',
    NEWLINE: '\n',
    CARRIAGE_RETURN: '\r'
};

const Whitespaces = Object.values(Whitespace);

function isWhitespace(value: string): boolean
{
    return Whitespaces.includes(value);
}

function isNewLine(value: string): boolean
{
    return value === Whitespace.NEWLINE;
}

export { Whitespace, Whitespaces, isWhitespace, isNewLine };
