
import { ESArrayBinding, ESObjectBinding, ESIdentifierBinding } from '@jitar/analysis';
import type { ESParameter } from '@jitar/analysis';
import { AccessLevels } from '@jitar/execution';

import { Keywords } from '../../definitions';
import type { SegmentImplementation as Implementation, Module, Segment } from '../../source';

export default class RemoteBuilder
{
    build(module: Module, segments: Segment[]): string
    {
        let code = '';

        const implementations = this.#getImplementations(module, segments);

        for (const implementation of implementations)
        {
            code += implementation.access === AccessLevels.PRIVATE
                ? this.#createPrivateCode(implementation)
                : this.#createPublicCode(implementation);
        }

        return code.trim();
    }

    #getImplementations(module: Module, segments: Segment[]): Implementation[]
    {
        const segmentModules = segments.map(segment => segment.getModule(module.filename));
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

    #createPrivateCode(implementation: Implementation): string
    {
        // Private procedures are not accessible from the outside.
        // Therefore we need to throw an error when they are called.

        const fqn = implementation.fqn;
        const version = implementation.version;

        const declaration = this.#createDeclaration(implementation);
        const body = `throw new ProcedureNotAccessible('${fqn}', '${version}');`;

        return this.#createFunction(declaration, body);
    }

    #createPublicCode(implementation: Implementation): string
    {
        // Public procedures are accessible from the outside.
        // Therefore we need to create a remote implementation.

        const fqn = implementation.fqn;
        const version = implementation.version;
        const args = this.#createArguments(implementation.model.parameters);

        const declaration = this.#createDeclaration(implementation);
        const body = `return __run('${fqn}', '${version}', { ${args} }, this);`;

        return this.#createFunction(declaration, body);
    }

    #createParameters(parameters: ESParameter[]): string
    {
        const result: string[] = [];

        for (const parameter of parameters)
        {
            if (parameter.binding instanceof ESIdentifierBinding)
            {
                result.push(parameter.binding.identifier);
            }
            else if (parameter.binding instanceof ESArrayBinding)
            {
                result.push(parameter.binding.toString());
            }
            else if (parameter.binding instanceof ESObjectBinding)
            {
                result.push(parameter.binding.toString());
            }
        }
        
        return result.join(', ');
    }

    #createArguments(parameters: ESParameter[]): string
    {
        const result = this.#extractArguments(parameters);
        
        return result.join(', ');
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
        const value = key.startsWith('...') ? key.substring(3) : key;

        return `'${key}': ${value}`;
    }

    #createDeclaration(implementation: Implementation): string
    {
        const name = implementation.model.identifier;
        const parameters = this.#createParameters(implementation.model.parameters);

        const prefix = implementation.importKey === Keywords.DEFAULT ? `${Keywords.DEFAULT} ` : '';

        return `\nexport ${prefix}async function ${name}(${parameters})`;
    }

    #createFunction(declaration: string, body: string): string
    {
        return `${declaration} {\n\t${body}\n}\n`;
    }
}
