
import { FileHelper } from '@jitar/runtime';
import { ReflectionImport, Reflector } from '@jitar/reflection';

import Keyword from '../definitions/Keyword.js';

const IMPORT_PATTERN = /import\s(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/._-]+)["'\s].*/g;
const APPLICATION_MODULE_INDICATORS = ['.', '/', 'http:', 'https:'];

const reflector = new Reflector();

export default class ImportRewriter
{
    rewrite(code: string, filename: string): string
    {
        const replacer = (statement: string) => this.#replaceImport(statement, filename);

        return code.replaceAll(IMPORT_PATTERN, replacer);
    }

    #replaceImport(statement: string, filename: string): string
    {
        const dependency = reflector.parseImport(statement);

        return this.#isApplicationModule(dependency)
            ? this.#rewriteApplicationImport(dependency, filename)
            : this.#rewriteRuntimeImport(dependency, filename);
    }

    #isApplicationModule(dependency: ReflectionImport): boolean
    {
        return APPLICATION_MODULE_INDICATORS.some(indicator => dependency.from.startsWith(indicator, 1));
    }

    #rewriteApplicationImport(dependency: ReflectionImport, filename: string): string
    {
        return this.#rewriteImport(dependency, 'application', filename);
    }

    #rewriteRuntimeImport(dependency: ReflectionImport, filename: string): string
    {
        return this.#rewriteImport(dependency, 'runtime', filename);
    }

    #rewriteImport(dependency: ReflectionImport, scope: string, filename: string): string
    {   
        const caller = FileHelper.assureAbsolutePath(filename);
        const from = this.#rewriteImportFrom(dependency, filename);

        if (dependency.members.length === 0)
        {
            return `await __import("${caller}", "${from}", "${scope}", true);`;
        }

        const members = this.#rewriteImportMembers(dependency);
        const extractDefault = this.#mustUseAs(dependency) ? 'true' : 'false';

        return `const ${members} = await __import("${caller}", "${from}", "${scope}", ${extractDefault});`;
    }

    #rewriteImportFrom(dependency: ReflectionImport, filename: string): string
    {
        const from = dependency.from.substring(1, dependency.from.length - 1);

        return this.#isApplicationModule(dependency)
            ? this.#mergeFilenames(filename, from)
            : from;
    }

    #rewriteImportMembers(dependency: ReflectionImport): string
    {
        if (this.#mustUseAs(dependency))
        {
            return dependency.members[0].as;
        }

        const members = dependency.members.map(member => member.name !== member.as ? `${member.name} : ${member.as}` : member.name);

        return `{ ${members.join(', ')} }`;
    }

    #mergeFilenames(sourceFilename: string, importFilename: string): string
    {
        const sourcePath = this.#extractFilepath(sourceFilename);

        const concatenated = `${sourcePath}/${importFilename}`;
        const translated = FileHelper.translatePath(concatenated);
        const rooted = FileHelper.assureAbsolutePath(translated);

        return FileHelper.assureExtension(rooted);
    }

    #extractFilepath(filename: string)
    {
        return filename.split('/').slice(0, -1).join('/');
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
