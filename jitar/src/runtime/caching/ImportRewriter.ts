
import * as Keywords from './definitions/Keywords.js';

const IMPORT_PATTERN = /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/_-]+)["'\s].*/g;
const NON_SYSTEM_INDICATORS = ['.', '/', 'http:', 'https:'];

class Dependency
{
    items: string;
    from: string;

    constructor(items: string, from: string)
    {
        this.items = items;
        this.from = from;
    }
}

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
        const dependency = this.#parseImport(statement);

        return this.#isSystemDependency(dependency)
            ? this.#rewriteImport(dependency)
            : statement;
    }

    static #parseImport(statement: string): Dependency
    {
        const hasSemicolon = statement.endsWith(';');
        const fromIndex = statement.indexOf('from');
        const endIndex = statement.length - (hasSemicolon ? 1 : 0);

        const items = statement.substring(6, fromIndex).trim();
        const from = statement.substring(fromIndex + 4, endIndex).trim().slice(1, -1);

        return new Dependency(items, from);
    }

    static #isSystemDependency(dependency: Dependency): boolean
    {
        return NON_SYSTEM_INDICATORS.some(indicator => dependency.from.startsWith(indicator)) === false;
    }

    static #isJitarDependency(dependency: Dependency): boolean
    {
        return dependency.from === Keywords.JITAR;
    }

    static #rewriteImport(dependency: Dependency): string
    {
        if (this.#isJitarDependency(dependency))
        {
            return `import ${dependency.items} from "/jitar/hooks.js";`;
        }

        return `const ${dependency.items} = await getDependency('${dependency.from}');`;
    }

    static #insertGetDependency(module: string): string
    {
        return `import { getDependency } from "/jitar/hooks.js";\n${module}`;
    }
}
