
import { ESModule, ESArrayBinding, ESObjectBinding, ESIdentifierBinding, ESBlock, ESModuleMember, ESExport, ESFunction, ESParameter, ESStatement } from '@jitar/analysis';
import { AccessLevels } from '@jitar/execution';

import { Keywords } from '../../definitions';
import type { SegmentImplementation as Implementation, Module, Segment } from '../../source';

export default class RemoteGenerator
{
    readonly #module: Module;
    readonly #segments: Segment[];

    constructor(module: Module, segments: Segment[])
    {
        this.#module = module;
        this.#segments = segments;
    }

    generate(): string
    {
        const statements: ESStatement[] = [];
        const implementations = this.#getImplementations();

        for (const implementation of implementations)
        {
            const declarations = implementation.access === AccessLevels.PRIVATE
                ? this.#createPrivate(implementation)
                : this.#createPublic(implementation);
            
            statements.push(...declarations);
        }

        const model = new ESModule(statements);

        return model.toString();
    }

    #getImplementations(): Implementation[]
    {
        const segmentModules = this.#segments.map(segment => segment.getModule(this.#module.filename));
        const implementations = segmentModules.flatMap(segmentModule => segmentModule!.getImplementations());

        // Implementation can be duplicated across segments
        // We need to ensure that each implementation is unique

        const unique = new Map<string, Implementation>();

        for (const implementation of implementations)
        {
            const key = `${implementation.fqn}:${implementation.version.toString()}`;

            unique.set(key, implementation);
        }

        return [...unique.values()];
    }

    #createPrivate(implementation: Implementation): ESStatement[]
    {
        // Private procedures are not accessible from the outside.
        // Therefore we need to throw an error when they are called.

        const fqn = implementation.fqn;
        const version = implementation.version;
        const code = `throw new ProcedureNotAccessible('${fqn}','${version}');`;

        return [
            this.#createExport(implementation),
            this.#createFunction(implementation, code)
        ];
    }

    #createPublic(implementation: Implementation): ESStatement[]
    {
        // Public procedures are accessible from the outside.
        // Therefore we need to create a remote implementation.

        const fqn = implementation.fqn;
        const version = implementation.version;
        const args = this.#createArguments(implementation.model.parameters);
        const code = `return __run('${fqn}','${version}',{${args}},this);`;

        return [
            this.#createExport(implementation),
            this.#createFunction(implementation, code)
        ];
    }

    #createExport(implementation: Implementation): ESExport
    {
        const identifier = implementation.model.identifier!;
        const alias = implementation.importKey === Keywords.DEFAULT ? Keywords.DEFAULT : undefined;

        const member = new ESModuleMember(identifier, alias);

        return new ESExport([member], undefined);
    }

    #createFunction(implementation: Implementation, code: string): ESFunction
    {
        const identifier = implementation.model.identifier;
        const parameters = implementation.model.parameters;
        const body = new ESBlock(`{${code}}`);
        const isAsync = implementation.model.isAsync;

        return new ESFunction(identifier, parameters, body, isAsync);
    }

    #createArguments(parameters: ESParameter[]): string
    {
        const result = this.#extractArguments(parameters);
        
        return result.join(',');
    }

    #extractArguments(parameters: ESParameter[]): string[]
    {
        const result: string[] = [];

        for (const parameter of parameters)
        {
            if (parameter.binding instanceof ESIdentifierBinding)
            {
                const argument = this.#createNamedArgument(parameter.binding);

                result.push(argument);
            }
            else if (parameter.binding instanceof ESArrayBinding)
            {
                const argumentz = this.#extractArguments(parameter.binding.elements);

                result.push(...argumentz);
            }
            else if (parameter.binding instanceof ESObjectBinding)
            {
                const argumentz = this.#extractArguments(parameter.binding.elements);

                result.push(...argumentz);
            }
        }
        
        return result;
    }

    #createNamedArgument(binding: ESIdentifierBinding): string
    {
        const key = binding.identifier;
        const value = binding.toString(); 

        return `'${key}':${value}`;
    }
}
