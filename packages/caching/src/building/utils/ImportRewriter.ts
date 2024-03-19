
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
        const from = this.#rewriteImportFrom(dependency, filename);

        if (dependency.members.length === 0)
        {
            return `await __import("${from}", "${scope}", true, "${filename}");`;
        }

        const members = this.#rewriteImportMembers(dependency);
        const extractDefault = this.#mustUseAs(dependency) ? 'true' : 'false';

        return `const ${members} = await __import("${from}", "${scope}", ${extractDefault}, "${filename}");`;
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
        const translated = this.#translateFilename(concatenated);
        const rooted = this.#ensureRoot(translated);

        return this.#ensureExtension(rooted);
    }

    #extractFilepath(filename: string)
    {
        return filename.split('/').slice(0, -1).join('/');
    }

    #translateFilename(filename: string)
    {
        const parts = filename.split('/');
        const translated = [];

        translated.push(parts[0]);

        for (let index = 1; index < parts.length; index++)
        {
            const part = parts[index].trim();

            switch (part)
            {
                case '': continue;
                case '.': continue;
                case '..': translated.pop(); continue;
            }

            translated.push(part);
        }

        return translated.join('/');
    }

    #ensureRoot(filename: string): string
    {
        if (filename.startsWith('./'))
        {
            return filename;
        }

        if (filename.startsWith('//'))
        {
            filename = filename.substring(1);
        }

        return filename.startsWith('/') ? `.${filename}` : `./${filename}`;
    }

    #ensureExtension(filename: string): string
    {
        return filename.endsWith('.js') ? filename : `${filename}.js`;
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
