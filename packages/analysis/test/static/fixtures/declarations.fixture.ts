
export const DECLARATIONS =
{
    EMPTY: "let name;",
    CONST: "const name = 'const';",
    LET: "let name = 'let';",
    VAR: "var name = 'var';",
    MULTIPLE: "let name1 = (1 + 2) * 3, name2, name3 = 'foo';",
    EXPRESSION: `const number = new Number(Math.ceil(Math.random()) + 10).toString();`,
    ARRAY: "const array = [ 'value1', 'value2' ];",
    OBJECT: "const object = { key1: 'value1', key2: 'value2' };",
    REGEX: "const regex = /regex/g;",
    DESTRUCTURING_ARRAY: "const [value1, value2 = true] = array;",
    DESTRUCTURING_OBJECT: "const {key1, key2 = false} = object;",
    KEYWORD_AS_NAME: "const as = 'value';",
    KEYWORD_AS_VALUE: "const alias = as;"
};
