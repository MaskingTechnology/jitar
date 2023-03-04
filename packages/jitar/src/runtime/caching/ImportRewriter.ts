
import { ReflectionImport, Reflector } from 'jitar-reflection';

import * as Keywords from './definitions/Keywords.js';

const IMPORT_PATTERN = /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/_-]+)["'\s].*/g;
const NON_SYSTEM_INDICATORS = ['.', '/', 'http:', 'https:'];

const reflector = new Reflector();

export default class ImportRewriter
{
    static rewrite(content: string): string
    {
        const replacer = (statement: string) => this.#replaceImport(statement);
        const newContent = content.replaceAll(IMPORT_PATTERN, replacer);

        return newContent !== content
            ? this.#insertGetDependency(newContent)
            : newContent;
    }

    static #replaceImport(statement: string): string
    {
        const dependency = reflector.parseImport(statement);

        return this.#isSystemDependency(dependency)
            ? this.#rewriteImport(dependency)
            : statement;
    }

    static #isSystemDependency(dependency: ReflectionImport): boolean
    {
        return NON_SYSTEM_INDICATORS.some(indicator => dependency.from.startsWith(indicator, 1)) === false;
    }

    static #isJitarDependency(dependency: ReflectionImport): boolean
    {
        return dependency.from.includes(Keywords.JITAR);
    }

    static #rewriteImport(dependency: ReflectionImport): string
    {
        if (dependency.members.length === 0)
        {
            return `await getDependency(${dependency.from});`;
        }

        const members = this.#rewriteImportMembers(dependency);

        if (this.#isJitarDependency(dependency))
        {
            return `import ${members} from "/jitar/hooks.js";`;
        }

        return `const ${members} = await getDependency(${dependency.from});`;
    }

    static #rewriteImportMembers(dependency: ReflectionImport): string
    {
        if (this.#mustUseAs(dependency))
        {
            return dependency.members[0].as;
        }

        const members = dependency.members.map(member => member.name !== member.as ? `${member.name}: ${member.as}` : member.name);

        return `{ ${members.join(', ')} }`;
    }

    static #mustUseAs(dependency: ReflectionImport): boolean
    {
        return this.#doesImportAll(dependency)
            || this.#doesImportDefault(dependency);
    }

    static #doesImportAll(dependency: ReflectionImport): boolean
    {
        return dependency.members.length === 1
            && dependency.members[0].name === '*';
    }

    static #doesImportDefault(dependency: ReflectionImport): boolean
    {
        return dependency.members.length === 1
            && dependency.members[0].name === 'default';
    }

    static #insertGetDependency(module: string): string
    {
        return `import { getDependency } from "/jitar/hooks.js";\n${module}`;
    }
}
