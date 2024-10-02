
import { VersionParser } from '@jitar/execution';
import type { FileManager } from '@jitar/sourcing';
import { ESDestructuredArray, ESDestructuredObject } from '@jitar/analysis';
import type { ESField, ESFunction, ESParameter } from '@jitar/analysis';
import { Logger } from '@jitar/logging';

import type { Application, Segment, SegmentModule } from '../source';
import { FileHelper } from '../utils';

const KEYWORD_DEFAULT = 'default';
const RUNTIME_IMPORTS = 'import { Segment, Class, Procedure, Implementation, Version, NamedParameter, ArrayParameter, ObjectParameter } from "jitar";';

export default class SegmentBuilder
{
    #fileManager: FileManager;

    #logger = new Logger();
    #fileHelper = new FileHelper();
    #versionParser = new VersionParser();

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async build(application: Application): Promise<void>
    {
        const segmentation = application.segmentation;

        const builds = segmentation.segments.map(segment => this.#buildSegment(segment));

        await Promise.all(builds);  
    }

    async #buildSegment(segment: Segment): Promise<void>
    {
        const filename = `${segment.name}.segment.js`;
        const code = this.#createCode(segment);

        await this.#fileManager.write(filename, code);

        this.#logger.info(`Built ${segment.name} segment (${segment.modules.length} modules, ${segment.procedures.length} procedures, ${segment.classes.length} classes)`);
    }

    #createCode(segment: Segment): string
    {
        const importCode = this.#createImportCode(segment);
        const segmentCode = this.#createSegmentCode(segment);

        return `${importCode}\n${segmentCode}`;
    }

    #createImportCode(segment: Segment): string
    {
        const moduleImports = this.#createModuleImports(segment);

        return `${RUNTIME_IMPORTS}\n${moduleImports}`;
    }

    #createModuleImports(segment: Segment): string
    {
        const imports = [];

        for (const module of segment.modules)
        {
            const filename = this.#fileHelper.addSubExtension(module.filename, segment.name);
            const members = this.#createModuleImportMembers(module);

            const importRule = `import ${members} from "./${filename}";`;

            imports.push(importRule);
        }

        return imports.join('\n');
    }

    #createModuleImportMembers(module: SegmentModule): string
    {
        const members = module.members;

        const defaultImplementation = members.find(member => member.importKey === KEYWORD_DEFAULT);
        const hasDefaultImplementation = defaultImplementation !== undefined;
        const defaultMemberImport = hasDefaultImplementation ? defaultImplementation.id : '';

        const namedImplementations = members.filter(member => member.importKey !== KEYWORD_DEFAULT);
        const nameImplementationImports = namedImplementations.map(member => `${member.importKey} as ${member.id}`);
        const hasNamedImplementations = namedImplementations.length > 0;
        const groupedNamedMemberImports = hasNamedImplementations ? `{ ${nameImplementationImports.join(', ')} }` : '';

        const separator = hasDefaultImplementation && hasNamedImplementations ? ', ' : '';

        return `${defaultMemberImport}${separator}${groupedNamedMemberImports}`;
    }

    #createSegmentCode(segment: Segment): string
    {
        const lines: string[] = [];
        
        lines.push(`export default new Segment("${segment.name}")`);

        for (const clazz of segment.classes)
        {
            lines.push(`\t.addClass(new Class("${clazz.fqn}", ${clazz.id}))`);
        }

        for (const procedure of segment.procedures)
        {
            lines.push(`\t.addProcedure(new Procedure("${procedure.fqn}")`);

            for (const implementation of procedure.implementations)
            {
                const version = this.#createVersionCode(implementation.version);
                const parameters = this.#createParametersCode(implementation.model);

                lines.push(`\t\t.addImplementation(new Implementation(${version}, "${implementation.access}", ${parameters}, ${implementation.id}))`);
            }

            lines.push('\t)');
        }

        return lines.join('\n');
    }

    #createVersionCode(versionString: string): string
    {
        const version = this.#versionParser.parse(versionString);

        return `new Version(${version.major}, ${version.minor}, ${version.patch})`;
    }

    #createParametersCode(model: ESFunction): string
    {
        const result = this.#extractParameters(model.parameters);

        return `[${result.join(', ')}]`;
    }

    #extractParameters(parameters: ESParameter[]): string[]
    {
        const result = [];

        // Named parameters are identified by their name.
        // Destructured parameters are identified by their index.

        for (const parameter of parameters)
        {
            result.push(this.#extractParameter(parameter));
        }

        return result;
    }

    #extractParameter(parameter: ESParameter): string
    {
        if (parameter instanceof ESDestructuredArray)
        {
            return this.#createArrayParameter(parameter);
        }
        else if (parameter instanceof ESDestructuredObject)
        {
            return this.#createObjectParameter(parameter);
        }

        return this.#createNamedParameter(parameter);
    }

    #createNamedParameter(parameter: ESField): string
    {
        return `new NamedParameter("${parameter.name}", ${parameter.value !== undefined})`;
    }

    #createArrayParameter(parameter: ESDestructuredArray): string
    {
        const members = this.#extractParameters(parameter.members);

        return `new ArrayParameter([${members.join(', ')}])`;
    }

    #createObjectParameter(parameter: ESDestructuredObject): string
    {
        const members = this.#extractParameters(parameter.members);

        return `new ObjectParameter([${members.join(', ')}])`;
    }
}
