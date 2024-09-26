
export const VALUES =
{
    ARRAY: '[1, "foo", false, new Person("Peter", 42), { a: 1, b: 2 }]',
    OBJECT: '{ key1: "value1", "key2": new Person().toString() }',
    EXPRESSION:'new Number(Math.ceil(Math.random()) + 10).toString();',
    EXPRESSION_GROUP: '(a + b) * c',
    IF_ELSE: 'if (true) { return "value1"; } else { return "value2"; }',
    TRY_CATCH_FINALLY: 'try { sum(1, 2); } catch (error) { console.error(error); } finally { console.log("finally"); }'
};
