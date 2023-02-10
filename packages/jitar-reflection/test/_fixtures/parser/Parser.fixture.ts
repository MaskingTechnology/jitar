
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

const CLASSES =
{
    DECLARATION: "class Name {}",
    EXTENDS: "class Name extends Parent {}",
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

const FUNCTIONS =
{

}

const FIELDS =
{
    EMPTY: "let name;",
    CONST: "const name = 'value';",
    LET: "let name = 'value';",
    VAR: "var name = 'value';",
}

export { IMPORTS, EXPORTS, CLASSES, FUNCTIONS, FIELDS }
