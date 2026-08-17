
import { ESModule, ESFunction, ESIdentifierBinding, ESParameter, ESArrayBinding, ESObjectBinding, ESImport, ESModuleMember, ESVariable, ESExport, ESExpression } from '@jitar/analysis';
import { VersionParser } from '@jitar/execution';

import type { Segment, SegmentMember } from '../../source';
import { FileHelper } from '../../utils';

const JITAR_MODULE = 'jitar';
const JITAR_IMPORTS = ['Segment', 'Class', 'Procedure', 'Implementation', 'Version', 'NamedParameter', 'ArrayParameter', 'ObjectParameter'];

export default class Generator
{
    readonly #segment: Segment;

    readonly #fileHelper = new FileHelper();
    readonly #versionParser = new VersionParser();

    constructor(segment: Segment)
    {
        this.#segment = segment;
    }

    generate(): string
    {
        const imports = this.#createImports();
        const exported = this.#createExport();
        const declaration = this.#createDeclaration();
        
        const model = new ESModule([...imports, exported, declaration]);

        return model.toString();
    }

    #createImports(): ESImport[]
    {
        const runtimeImport = this.#createRuntimeImport();
        const moduleImports = this.#createModuleImports();

        return [runtimeImport, ...moduleImports];
    }

    #createRuntimeImport(): ESImport
    {
        const members = JITAR_IMPORTS.map(identifier => new ESModuleMember(identifier));

        return new ESImport(members, JITAR_MODULE);
    }

    #createModuleImports(): ESImport[]
    {
        const segmentName = this.#segment.name;
        const modules = this.#segment.getSegmentedModules();

        const imports: ESImport[] = [];

        for (const module of modules)
        {
            const segmentedFilename = this.#fileHelper.addSubExtension(module.filename, segmentName);
            const segmentedFrom = `./${segmentedFilename}`;
            
            if (module.members.length === 0)
            {
                const model = new ESImport([], segmentedFrom);

                imports.push(model);
                
                continue;
            }

            const classes = module.classes;
            const implementations = module.implementations;

            if (classes.length > 0)
            {
                const commonFrom = `./${module.filename}`;
                
                const model = this.#createModuleImport(classes, commonFrom);

                imports.push(model);
            }
            
            if (implementations.length > 0)
            {
                const model = this.#createModuleImport(implementations, segmentedFrom);

                imports.push(model);
            }
        }

        return imports;
    }

    #createModuleImport(segmentMembers: SegmentMember[], from: string): ESImport
    {
        if (segmentMembers.length === 0)
        {
            return new ESImport([], from);
        }
        
        const importMembers = segmentMembers.map(member => new ESModuleMember(member.importKey, member.id));

        return new ESImport(importMembers, from);
    }

    #createExport(): ESExport
    {
        const member = new ESModuleMember('segment', 'default');

        return new ESExport([member], undefined);
    }

    #createDeclaration(): ESVariable
    {
        const lines: string[] = [];

        const segmentName = this.#segment.name;
        const classes = this.#segment.classes;
        const procedures = this.#segment.procedures;

        lines.push(`new Segment("${segmentName}")`);

        for (const clazz of classes)
        {
            lines.push(`\t.addClass(new Class("${clazz.fqn}", ${clazz.id}))`);
        }

        for (const procedure of procedures)
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

        const code = lines.join('\n');

        const initializer = new ESExpression(code);
        const binding = new ESIdentifierBinding('segment');

        return new ESVariable('const', binding, initializer);
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
        if (parameter.binding instanceof ESArrayBinding)
        {
            return this.#createArrayParameter(parameter);
        }
        else if (parameter.binding instanceof ESObjectBinding)
        {
            return this.#createObjectParameter(parameter);
        }

        return this.#createNamedParameter(parameter);
    }

    #createNamedParameter(parameter: ESParameter): string
    {
        const binding = parameter.binding as ESIdentifierBinding;

        return `new NamedParameter("${binding}", ${parameter.initializer !== undefined})`;
    }

    #createArrayParameter(parameter: ESParameter): string
    {
        const binding = parameter.binding as ESArrayBinding;
        const members = this.#extractParameters(binding.elements);

        return `new ArrayParameter([${members.join(', ')}])`;
    }

    #createObjectParameter(parameter: ESParameter): string
    {
        const binding = parameter.binding as ESObjectBinding;
        const members = this.#extractParameters(binding.elements);

        return `new ObjectParameter([${members.join(', ')}])`;
    }
}
