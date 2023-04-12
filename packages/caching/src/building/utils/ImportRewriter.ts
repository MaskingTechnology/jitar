
import { ReflectionImport, Reflector } from '@jitar/reflection';

import Keyword from '../definitions/Keyword.js';

const IMPORT_PATTERN = /import\s(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/_-]+)["'\s].*/g;
const NON_SYSTEM_INDICATORS = ['.', '/', 'http:', 'https:'];

const reflector = new Reflector();

export default class ImportRewriter
{
    rewrite(code: string): string
    {
        const replacer = (statement: string) => this.#replaceImport(statement);

        return code.replaceAll(IMPORT_PATTERN, replacer);
    }

    #replaceImport(statement: string): string
    {
        const dependency = reflector.parseImport(statement);

        return this.#isSystemDependency(dependency)
            ? this.#rewriteImport(dependency)
            : statement;
    }

    #isSystemDependency(dependency: ReflectionImport): boolean
    {
        return NON_SYSTEM_INDICATORS.some(indicator => dependency.from.startsWith(indicator, 1)) === false;
    }

    #rewriteImport(dependency: ReflectionImport): string
    {
        if (dependency.members.length === 0)
        {
            return `await __getDependency(${dependency.from});`;
        }

        const members = this.#rewriteImportMembers(dependency);

        return `const ${members} = await __getDependency(${dependency.from});`;
    }

    #rewriteImportMembers(dependency: ReflectionImport): string
    {
        if (this.#mustUseAs(dependency))
        {
            return dependency.members[0].as;
        }

        const members = dependency.members.map(member => member.name !== member.as ? `${member.name}: ${member.as}` : member.name);

        return `{ ${members.join(', ')} }`;
    }

    #mustUseAs(dependency: ReflectionImport): boolean
    {
        return this.#doesImportAll(dependency)
            || this.#doesImportDefault(dependency);
    }

    #doesImportAll(dependency: ReflectionImport): boolean
    {
        return dependency.members.length === 1
            && dependency.members[0].name === '*';
    }

    #doesImportDefault(dependency: ReflectionImport): boolean
    {
        return dependency.members.length === 1
            && dependency.members[0].name === Keyword.DEFAULT;
    }
}
