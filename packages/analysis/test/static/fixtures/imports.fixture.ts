
export const IMPORTS =
{
    LOAD: "import 'module'",
    IMPORT: "import { member } from 'module'",
    IMPORT_AS: "import { member as alias } from 'module'",
    IMPORT_ALL: "import * as name from 'module'",
    IMPORT_DEFAULT: "import name from 'module'",
    IMPORT_DEFAULT_MEMBER: "import name, { member } from 'module'",
    IMPORT_DEFAULT_MEMBER_AS: "import name, { member as alias } from 'module'",
    IMPORT_MULTIPLE_MEMBERS_AS: "import { name, member as alias } from 'module'",
    IMPORT_DYNAMIC: "import('module')",
};
