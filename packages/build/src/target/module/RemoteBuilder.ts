
import { ESDestructuredArray, ESDestructuredObject, ESDestructuredValue, ESField } from '@jitar/analysis';
import type { ESParameter } from '@jitar/analysis';
import { AccessLevels } from '@jitar/execution';

import type { SegmentImplementation as Implementation } from '../../source';

export default class RemoteBuilder
{
    build(implementations: Implementation[]): string
    {
        let code = '';

        for (const implementation of implementations)
        {
            code += implementation.access === AccessLevels.PRIVATE
                ? this.#createPrivateCode(implementation)
                : this.#createPublicCode(implementation);
        }

        return code.trim();
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
            if (parameter instanceof ESField)
            {
                result.push(parameter.name);
            }
            else if (parameter instanceof ESDestructuredArray)
            {
                result.push(parameter.toString());
            }
            else if (parameter instanceof ESDestructuredObject)
            {
                result.push(parameter.toString());
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
            if (parameter instanceof ESDestructuredValue)
            {
                const argumentz = this.#extractArguments(parameter.members);

                result.push(...argumentz);
            }
            else if (parameter instanceof ESField)
            {
                const argument = this.#createNamedArgument(parameter);

                result.push(argument);
            }
        }
        
        return result;
    }

    #createNamedArgument(parameter: ESField): string
    {
        const key = parameter.name;
        const value = key.startsWith('...') ? key.substring(3) : key;

        return `'${key}': ${value}`;
    }

    #createDeclaration(implementation: Implementation): string
    {
        const name = implementation.model.name;
        const parameters = this.#createParameters(implementation.model.parameters);

        const prefix = implementation.importKey === 'default' ? 'default ' : '';

        return `\nexport ${prefix}async function ${name}(${parameters})`;
    }

    #createFunction(declaration: string, body: string): string
    {
        return `${declaration} {\n\t${body}\n}\n`;
    }
}
