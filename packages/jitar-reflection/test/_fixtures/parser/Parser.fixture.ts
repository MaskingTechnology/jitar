
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
    CONST: "const name = 'value';",
    LET: "let name = 'value';",
    VAR: "var name = 'value';",
}

const FUNCTIONS =
{

}

const CLASSES =
{

}

export { IMPORTS, EXPORTS, FIELDS, FUNCTIONS, CLASSES }
