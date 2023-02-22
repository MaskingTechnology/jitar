
const CODE =
{
    OPERATORS: `=====!=/=/!=`,
    STATEMENT: `const identifier = (12 >= 3) ? { 'foo' } : [ "bar" ];`,
    WHITESPACE_EXCLUDED: `const identifier="value";`,
    WHITESPACE_INCLUDED: `const identifier\n=\t"value" ;`,
    COMMENT_LINE: `const // This is a comment\nidentifier`,
    COMMENT_BLOCK: `const /* This is a comment */ identifier`
}

export { CODE };
