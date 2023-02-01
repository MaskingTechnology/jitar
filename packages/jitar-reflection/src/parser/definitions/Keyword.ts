
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
    ASYNC: 'async'
};

const Keywords = Object.values(Keyword);

function isKeyword(value: string): boolean
{
    return Keywords.includes(value);
}

export { Keyword, Keywords, isKeyword };
