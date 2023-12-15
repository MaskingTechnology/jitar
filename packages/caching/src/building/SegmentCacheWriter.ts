
import { ReflectionDestructuredArray, ReflectionDestructuredObject, ReflectionField, ReflectionFunction, ReflectionParameter } from '@jitar/reflection';
import { FileManager, VersionParser, createNodeFilename, createRepositoryFilename } from '@jitar/runtime';

import SegmentCache from './models/SegmentCache.js';
import SegmentImport from './models/SegmentImport.js';
import SegmentProcedure from './models/SegmentProcedure.js';

export default class SegmentCacheWriter
{
    #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async write(cache: SegmentCache): Promise<void>
    {
        return Promise.all([
            this.#writeNodeCache(cache),
            this.#writeRepositoryCache(cache)
        ]).then(() => undefined);
    }

    async #writeNodeCache(cache: SegmentCache): Promise<void>
    {
        const importCode = this.#createImportCode(cache.imports);
        const segmentCode = this.#createSegmentCode(cache.name, cache.procedures);

        const filename = createNodeFilename(cache.name);
        const code = `${importCode}\n${segmentCode}`;

        return this.#fileManager.write(filename, code);
    }

    async #writeRepositoryCache(cache: SegmentCache): Promise<void>
    {
        const filename = createRepositoryFilename(cache.name);
        const code = `export const files = [\n\t"${[...cache.files].join('",\n\t"')}"\n];`;

        return this.#fileManager.write(filename, code);
    }

    #createImportCode(imports: SegmentImport[]): string
    {
        const codes: string[] = [];

        for (const { members, from } of imports)
        {
            codes.push(`const { ${members.join(', ')} } = await __import("./${from}", "application", false);`);
        }

        return codes.join('\n');
    }

    #createSegmentCode(name: string, procedures: SegmentProcedure[]): string
    {
        const codes: string[] = [];
        
        codes.push('const { Segment, Procedure, Implementation, Version, NamedParameter, ArrayParameter, ObjectParameter } = await __import("jitar", "runtime", false);');
        codes.push(`export const segment = new Segment("${name}")`);

        for (const procedure of procedures)
        {
            codes.push(`\t.addProcedure(new Procedure("${procedure.fqn}")`);

            for (const implementation of procedure.implementations)
            {
                const version = this.#createVersionCode(implementation.version);
                const parameters = this.#createParametersCode(implementation.executable);

                codes.push(`\t\t.addImplementation(new Implementation(${version}, "${implementation.access}", ${parameters}, ${implementation.id}))`);
            }

            codes.push('\t)');
        }

        return codes.join('\n');
    }

    #createVersionCode(versionString: string): string
    {
        const version = VersionParser.parse(versionString);

        return `new Version(${version.major}, ${version.minor}, ${version.patch})`;
    }

    #createParametersCode(executable: ReflectionFunction): string
    {
        const result = this.#extractParameters(executable.parameters);

        return `[${result.join(', ')}]`;
    }

    #extractParameters(parameters: ReflectionParameter[]): string[]
    {
        const result: string[] = [];

        // Named parameters are identified by their name.
        // Destructured parameters are identified by their index.

        for (const parameter of parameters)
        {
            result.push(this.#extractParameter(parameter));
        }

        return result;
    }

    #extractParameter(parameter: ReflectionParameter): string
    {
        if (parameter instanceof ReflectionDestructuredArray)
        {
            return this.#createArrayParameter(parameter);
        }
        else if (parameter instanceof ReflectionDestructuredObject)
        {
            return this.#createObjectParameter(parameter);
        }

        return this.#createNamedParameter(parameter);
    }

    #createNamedParameter(parameter: ReflectionField): string
    {
        return `new NamedParameter("${parameter.name}", ${parameter.value !== undefined})`;
    }

    #createArrayParameter(parameter: ReflectionDestructuredArray): string
    {
        const members = this.#extractParameters(parameter.members);

        return `new ArrayParameter([${members.join(', ')}])`;
    }

    #createObjectParameter(parameter: ReflectionDestructuredObject): string
    {
        const members = this.#extractParameters(parameter.members);

        return `new ObjectParameter([${members.join(', ')}])`;
    }
}
