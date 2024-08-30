
import { ReflectionDestructuredArray, ReflectionDestructuredObject, ReflectionDestructuredValue, ReflectionField } from '@jitar/reflection';
import type { ReflectionParameter } from '@jitar/reflection';
import { AccessLevels } from '@jitar/execution';

import type { SegmentImplementation as Implementation } from '../source';

export default class RemoteModuleBuilder
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
        const args = this.#createArguments(implementation.executable.parameters);

        const declaration = this.#createDeclaration(implementation);
        const body = `return __run('${fqn}', '${version}', { ${args} }, this);`;

        return this.#createFunction(declaration, body);
    }

    #createParameters(parameters: ReflectionParameter[]): string
    {
        const result: string[] = [];

        for (const parameter of parameters)
        {
            if (parameter instanceof ReflectionField)
            {
                result.push(parameter.name);
            }
            else if (parameter instanceof ReflectionDestructuredArray)
            {
                result.push(parameter.toString());
            }
            else if (parameter instanceof ReflectionDestructuredObject)
            {
                result.push(parameter.toString());
            }
        }
        
        return result.join(', ');
    }

    #createArguments(parameters: ReflectionParameter[]): string
    {
        const result = this.#extractArguments(parameters);
        
        return result.join(', ');
    }

    #extractArguments(parameters: ReflectionParameter[]): string[]
    {
        const result: string[] = [];

        for (const parameter of parameters)
        {
            if (parameter instanceof ReflectionDestructuredValue)
            {
                const argumentz = this.#extractArguments(parameter.members);

                result.push(...argumentz);
            }
            else if (parameter instanceof ReflectionField)
            {
                const argument = this.#createNamedArgument(parameter);

                result.push(argument);
            }
        }
        
        return result;
    }

    #createNamedArgument(parameter: ReflectionField): string
    {
        const key = parameter.name;
        const value = key.startsWith('...') ? key.substring(3) : key;

        return `'${key}': ${value}`;
    }

    #createDeclaration(implementation: Implementation): string
    {
        const name = implementation.executable.name;
        const parameters = this.#createParameters(implementation.executable.parameters);

        const prefix = implementation.importDefault ? 'default ' : '';

        return `\nexport ${prefix}async function ${name}(${parameters})`;
    }

    #createFunction(declaration: string, body: string): string
    {
        return `${declaration} {\n\t${body}\n}\n`;
    }
}
