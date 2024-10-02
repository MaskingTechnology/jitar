
const Keyword =
{
    EXPORT: 'export',
    DEFAULT: 'default',
    CLASS: 'class',
    FUNCTION: 'function',
    CONST: 'const',
    LET: 'let',
    VAR: 'var',
    AS: 'as',
    FROM: 'from',
    IMPORT: 'import',
    GET: 'get',
    SET: 'set',
    EXTENDS: 'extends',
    STATIC: 'static',
    ASYNC: 'async',
    RETURN: 'return',
    // Other keywords are not needed in the parse
    // process and must be treated as identifiers.
};

const Keywords = Object.values(Keyword);

function isKeyword(value: string): boolean
{
    return Keywords.includes(value);
}

function isDeclaration(value: string): boolean
{
    return value === Keyword.CLASS
        || value === Keyword.FUNCTION
        || value === Keyword.CONST
        || value === Keyword.LET
        || value === Keyword.VAR;
}

function isNotReserved(value: string): boolean
{
    return value === Keyword.AS
        || value === Keyword.ASYNC
        || value === Keyword.FROM
        || value === Keyword.GET
        || value === Keyword.SET;
}

export { Keyword, isKeyword, isDeclaration, isNotReserved };
