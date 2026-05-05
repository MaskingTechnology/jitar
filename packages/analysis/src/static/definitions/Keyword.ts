
const Keyword =
{
    // Modules
    IMPORT: 'import',
    EXPORT: 'export',
    AS: 'as',
    FROM: 'from',
    DEFAULT: 'default',

    // Declarations
    ASYNC: 'async',
    USING: 'using',
    CONST: 'const',
    LET: 'let',
    VAR: 'var',

    // Functions
    FUNCTION: 'function',
    RETURN: 'return',
    YIELD: 'yield',

    // Classes
    CLASS: 'class',
    CONSTRUCTOR: 'constructor',
    GET: 'get',
    SET: 'set',
    EXTENDS: 'extends',
    STATIC: 'static',
    NEW: 'new',

    // Iterations
    DO: 'do',
    WHILE: 'while',
    FOR: 'for',
    OF: 'of',
    IN: 'in',
    BREAK: 'break',
    CONTINUE: 'continue',
    
    // Control flow
    IF: 'if',
    ELSE: 'else',
    SWITCH: 'switch',
    CASE: 'case',
    
    // Exceptions
    THROW: 'throw',
    TRY: 'try',
    CATCH: 'catch',
    FINALLY: 'finally'
};

const Keywords = Object.values(Keyword);

const RootKeywords = // That we parse at module level
[
    Keyword.IMPORT, Keyword.EXPORT,
    Keyword.VAR, Keyword.LET, Keyword.CONST, Keyword.FUNCTION, Keyword.CLASS,
    Keyword.ASYNC
];

const DeclarationKeywords = // Things to import / export
[
    Keyword.VAR, Keyword.LET, Keyword.CONST,
    Keyword.FUNCTION, Keyword.CLASS,
];

const ContextualKeywords = // Are also valid identifiers
[
    Keyword.AS, Keyword.ASYNC, Keyword.GET, Keyword.SET,
    Keyword.OF, Keyword.YIELD, Keyword.FROM, Keyword.STATIC
];

function isKeyword(value: string): boolean
{
    return Keywords.includes(value);
}

function isRootKeyword(value: string): boolean
{
    return RootKeywords.includes(value);
}

function isNotRootKeyword(value: string): boolean
{
    return isRootKeyword(value) === false;
}

function isDeclaration(value: string): boolean
{
    return DeclarationKeywords.includes(value);
}

function isContextualKeyword(value: string): boolean
{
    return ContextualKeywords.includes(value);
}

export { Keyword, isKeyword, isRootKeyword, isNotRootKeyword, isDeclaration, isContextualKeyword };
