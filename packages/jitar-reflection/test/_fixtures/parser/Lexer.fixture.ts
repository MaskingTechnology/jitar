
const CODE =
{
    OPERATORS: `=====!=/=/!=`,
    LITERALS: '`foo\\\`ter`"bar\\\"becue"\'baz\'',
    KEYWORDS_IDENTIFIERS: 'class Foo function bar',
    WHITESPACE: `const identifier\n=\t"value" ;`,
    COMMENT_LINE: `const // This is a comment\nidentifier`,
    COMMENT_BLOCK: `const /* This is a comment */ identifier`,
    STATEMENT: `const identifier = (12 >= 3) ? { 'foo' } : [ "bar" ];`,
    MINIFIED: 'return`foo`;identifier1=identifier2'
}

export { CODE };
