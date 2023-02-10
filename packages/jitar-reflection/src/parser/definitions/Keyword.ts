
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
    NEW: 'new',
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

export { Keyword, Keywords, isKeyword, isDeclaration };
