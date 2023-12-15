
import { ReflectionDestructuredArray, ReflectionDestructuredObject, ReflectionDestructuredValue, ReflectionField, ReflectionParameter } from '@jitar/reflection';
import { AccessLevels } from '@jitar/runtime';

import Keyword from '../definitions/Keyword.js';

import SegmentImplementation from '../models/SegmentImplementation.js';
import SegmentModule from '../models/SegmentModule.js';

export default class RemoteBuilder
{
    build(module: SegmentModule): string
    {
        let code = '';

        for (const procedure of module.procedures)
        {
            for (const implementation of procedure.implementations)
            {
                const asDefault = implementation.importKey === Keyword.DEFAULT;

                code += implementation.access === AccessLevels.PRIVATE
                    ? this.#createPrivateCode(procedure.fqn, implementation, asDefault)
                    : this.#createPublicCode(procedure.fqn, implementation, asDefault);
            }
        }

        return code.trim();
    }

    #createPrivateCode(fqn: string, implementation: SegmentImplementation, asDefault: boolean): string
    {
        // Private procedures are not accessible from the outside.
        // Therefore we need to throw an error when they are called.

        const version = implementation.version;

        const declaration = this.#createDeclaration(implementation, asDefault);
        const body = `throw new ProcedureNotAccessible('${fqn}', '${version}');`;

        return this.#createFunction(declaration, body);
    }

    #createPublicCode(fqn: string, implementation: SegmentImplementation, asDefault: boolean): string
    {
        // Public procedures are accessible from the outside.
        // Therefore we need to create a remote implementation.

        const version = implementation.version;
        const args = this.#createArguments(implementation.executable.parameters);

        const declaration = this.#createDeclaration(implementation, asDefault);
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

    #createDeclaration(implementation: SegmentImplementation, asDefault: boolean): string
    {
        const name = implementation.executable.name;
        const parameters = this.#createParameters(implementation.executable.parameters);

        const prefix = asDefault ? `${Keyword.DEFAULT} ` : '';

        return `\nexport ${prefix}async function ${name}(${parameters})`;
    }

    #createFunction(declaration: string, body: string): string
    {
        return `${declaration} {\n\t${body}\n}\n`;
    }
}
