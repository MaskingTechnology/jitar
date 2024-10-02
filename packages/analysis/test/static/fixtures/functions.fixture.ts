
export const FUNCTIONS =
{
    DECLARATION: "function name() {}",
    ASYNC_DECLARATION: "async function name() {}",
    EXPRESSION: "const name = function() {}",
    ASYNC_EXPRESSION: "const name = async function() {}",
    ARROW: "const name = () => {}",
    ARROW_EXPRESSION: "const name = () => 'value';",
    ARROW_ARGUMENT: 'const name = arg => arg;',
    ASYNC_ARROW: "const name = async () => {}",
    GENERATOR: "function* name() {}",
    ASYNC_GENERATOR: "async function* name() {}",
    EXPRESSION_GENERATOR: "const name = function*() {}",
    ASYNC_EXPRESSION_GENERATOR: "const name = async function*() {}",
    PARAMETERS: "function name(param1, param2) {}",
    DEFAULT_PARAMETERS: "function name(param1 = 'value1', param2 = true) {}",
    REST_PARAMETERS: "function name(...param1) {}",
    DESTRUCTURING_PARAMETERS: "function name({ param1, param2 }, [ param3, param4 ]) {}",
    DESTRUCTURING_DEFAULT_PARAMETERS: "function name({ param1 = 'value1', param2 = true }, [ param3 = 'value3', param4 = true ]) {}",
    DESTRUCTURING_REST_PARAMETERS: "function name({ param1, param2 }, [ param3, ...param4 ]) {}",
    SIMPLE_BODY: "function name() { return 'value'; }",
    BLOCK_BODY: "function name() { if (true) { return 'value'; } }",
    KEYWORD_AS_NAME: "function as() {}"
};
