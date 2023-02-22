
const VALUES =
{
    ARRAY: '[1, "foo", false, new Person("Peter", 42), { a: 1, b: 2 }]',
    OBJECT: '{ key1: "value1", "key2": new Person().toString() }',
    EXPRESSION:'new Number(Math.ceil(Math.random()) + 10).toString();',
    EXPRESSION_GROUP: '(a + b) * c',
    IF_ELSE: 'if (true) { return "value1"; } else { return "value2"; }',
    TRY_CATCH_FINALLY: 'try { sum(1, 2); } catch (error) { console.error(error); } finally { console.log("finally"); }'
}

const IMPORTS =
{
    LOAD: "import 'module'",
    IMPORT: "import { member } from 'module'",
    IMPORT_AS: "import { member as alias } from 'module'",
    IMPORT_ALL: "import * as name from 'module'",
    IMPORT_DEFAULT: "import name from 'module'",
    IMPORT_DEFAULT_MEMBER: "import name, { member } from 'module'",
    IMPORT_DEFAULT_MEMBER_AS: "import name, { member as alias } from 'module'",
    IMPORT_MULTIPLE_MEMBERS_AS: "import { name, member as alias } from 'module'",
}

const EXPORTS =
{
    EXPORT: "export { member }",
    EXPORT_AS: "export { member as alias }",
    EXPORT_DEFAULT: "export default name",
    EXPORT_MULTIPLE: "export { name, member }",
    EXPORT_MULTIPLE_AS: "export { name, member as alias }",
    EXPORT_CLASS_DECLARATION: "export class name {}",
    EXPORT_FIELD_DECLARATION: "export const name = 'value'",
    EXPORT_FUNCTION_DECLARATION: "export function name() {}",
    EXPORT_ASYNC_FUNCTION_DECLARATION: "export async function name() {}",
    REEXPORT_ALL: "export * from 'module'",
    REEXPORT_MEMBER: "export { member } from 'module'",
}

const FIELDS =
{
    EMPTY: "let name;",
    CONST: "const name = 'const';",
    LET: "let name = 'let';",
    VAR: "var name = 'var';",
    EXPRESSION: `const number = new Number(Math.ceil(Math.random()) + 10).toString();`,
    ARRAY: "const array = [ 'value1', 'value2' ];",
    OBJECT: "const object = { key1: 'value1', key2: 'value2' };",
}

const FUNCTIONS =
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
}

const CLASSES =
{
    DECLARATION: "class Name {}",
    EXTENDS: "class Name extends Parent {}",
    EXPRESSION: "const name = class {}",
    MEMBERS: `class Name
{
    #field1 = 'value1';
    field2;

    static #field3 = "value3";
    static field4;

    constructor(field1, ...field2)
    {
        this.#field1 = field1;
        this.field2 = field2;
    }
    
    get #getter1() { return field1; }

    get getter2() { return field2; }

    static get #getter3() { return field3; }

    static get getter4() { return field4; }

    set #setter1(value) { this.#field1 = value; }

    set setter2(value) { this.#field2 = value; }

    static set #setter3(value) { this.#field3 = value; }

    static set setter4(value) { this.#field4 = value; }

    method1() { return this.#field1; }

    async method2() { return this.#field1; }

    static method3() { return this.#field1; }

    static async method4() { return this.#field1; }

    #method5() { return this.#field1; }
}`,
}

const MODULES =
{
    TERMINATED:
`
import { member } from 'module';
import { member as alias } from 'module2';

const name = 'Peter' + ' van ' + 'Vliet';

export default function sum(a, b) { return a + b; }

[1, 2, 3, 4, 5].sort((a, b) => a - b);

try { sum(1, 2); } catch (error) { console.error(error); }

export class Person
{
    #name;
    #age;

    constructor(name, age)
    {
        this.#name = name;
        this.#age = age;
    }
}

const peter = new Person(name, 42);

export { name, peter };
`,
    UNTERMINATED:
`
    import { member } from 'module'
    import { member as alias } from 'module2'
    
    const name = 'Peter' + ' van ' + 'Vliet'
    
    export default function sum(a, b) { return a + b }
    
    [1, 2, 3, 4, 5].sort((a, b) => a - b)
    
    try { sum(1, 2) } catch (error) { console.error(error) }
    
    export class Person
    {
        #name
        #age
    
        constructor(name, age)
        {
            this.#name = name
            this.#age = age
        }
    }
    
    const peter = new Person(name, 42)
    
    export { name, peter }
`,
}

export { VALUES, IMPORTS, EXPORTS, FIELDS, FUNCTIONS, CLASSES, MODULES  }
