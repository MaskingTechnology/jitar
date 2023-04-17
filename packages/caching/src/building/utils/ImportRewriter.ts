
import { ReflectionImport, Reflector } from '@jitar/reflection';

import Keyword from '../definitions/Keyword.js';

const IMPORT_PATTERN = /import\s(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/_-]+)["'\s].*/g;
const NON_SYSTEM_INDICATORS = ['.', '/', 'http:', 'https:'];

const reflector = new Reflector();

export default class ImportRewriter
{
    rewrite(code: string, includeSystem: boolean): string
    {
        const replacer = (statement: string) => this.#replaceImport(statement, includeSystem);

        return code.replaceAll(IMPORT_PATTERN, replacer);
    }

    #replaceImport(statement: string, includeSystem: boolean): string
    {
        const dependency = reflector.parseImport(statement);

        if (this.#isSystemDependency(dependency))
        {
            return includeSystem
                ? this.#rewriteSystemImport(dependency)
                : statement;
        }

        return this.#rewriteApplicationImport(dependency);
    }

    #isSystemDependency(dependency: ReflectionImport): boolean
    {
        return NON_SYSTEM_INDICATORS.some(indicator => dependency.from.startsWith(indicator, 1)) === false;
    }

    #rewriteSystemImport(dependency: ReflectionImport): string
    {   
        const from = this.#rewriteImportFrom(dependency);

        if (dependency.members.length === 0)
        {
            return `await __getDependency('${from}');`;
        }

        const members = this.#rewriteImportMembers(dependency, ':');

        return `const ${members} = await __getDependency('${from}');`;
    }

    #rewriteApplicationImport(dependency: ReflectionImport): string
    {
        const members = this.#rewriteImportMembers(dependency, 'as');
        const from = this.#rewriteImportFrom(dependency);

        return `import ${members} from '${from}';`;
    }

    #rewriteImportMembers(dependency: ReflectionImport, aliasSpecifier: string): string
    {
        if (this.#mustUseAs(dependency))
        {
            return dependency.members[0].as;
        }

        const members = dependency.members.map(member => member.name !== member.as ? `${member.name} ${aliasSpecifier} ${member.as}` : member.name);

        return `{ ${members.join(', ')} }`;
    }

    #rewriteImportFrom(dependency: ReflectionImport): string
    {
        const from = dependency.from.substring(1, dependency.from.length - 1);

        if (NON_SYSTEM_INDICATORS.some(indicator => from.startsWith(indicator)))
        {
            return from.endsWith('.js') ? from : `${from}.js`;
        }
        
        return from;
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
