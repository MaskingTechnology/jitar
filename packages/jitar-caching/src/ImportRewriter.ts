
import { ReflectionImport, Reflector } from 'jitar-reflection';

const IMPORT_PATTERN = /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/_-]+)["'\s].*/g;
const NON_SYSTEM_INDICATORS = ['.', '/', 'http:', 'https:'];

const reflector = new Reflector();

export default class ImportRewriter
{
    rewrite(code: string): string
    {
        const replacer = (statement: string) => this.#replaceImport(statement);
        const newContent = code.replaceAll(IMPORT_PATTERN, replacer);

        return newContent !== code
            ? this.#insertGetDependency(newContent)
            : newContent;
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

    #isJitarDependency(dependency: ReflectionImport): boolean
    {
        return dependency.from.includes('jitar');
    }

    #rewriteImport(dependency: ReflectionImport): string
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
            && dependency.members[0].name === 'default';
    }

    #insertGetDependency(module: string): string
    {
        return `import { getDependency } from "/jitar/hooks.js";\n${module}`;
    }
}
