
import { ReflectionDestructuredArray, ReflectionDestructuredObject, ReflectionField, ReflectionFunction } from 'jitar-reflection';
import ReflectionParameter from 'jitar-reflection/dist/models/ReflectionParameter.js';
import { AccessLevel } from 'jitar-runtime';

import Keyword from '../definitions/Keyword.js';

import SegmentImplementation from '../models/SegmentImplementation.js';
import SegmentModule from '../models/SegmentModule.js';

export default class RemoteBuilder
{
    build(module: SegmentModule): string
    {
        let code = this.#createRemoteImports();

        for (const procedure of module.procedures)
        {
            for (const implementation of procedure.implementations)
            {
                if (implementation.access !== AccessLevel.PUBLIC)
                {
                    continue;
                }

                const asDefault = implementation.importKey === Keyword.DEFAULT;

                code += this.#createRemoteCode(procedure.fqn, implementation, asDefault);
            }
        }

        return code.trim();
    }

    #createRemoteImports(): string
    {
        return `import { runProcedure } from "/jitar/hooks.js";\n`;
    }

    #createRemoteCode(fqn: string, implementation: SegmentImplementation, asDefault: boolean): string
    {
        const name = implementation.executable.name;
        const version = implementation.version;
        const parameters = this.#createParameters(implementation.executable.parameters);
        const argumentz = this.#createArguments(implementation.executable.parameters);

        const functionName = `\nexport ${asDefault ? `${Keyword.DEFAULT} ` : ''}async function ${name}(${parameters})`;
        const functionBody = `return runProcedure('${fqn}', '${version}', { ${argumentz} }, this)`;

        return `${functionName} {\n\t${functionBody}\n}\n`;
    }

    #createParameters(parameters: ReflectionParameter[]): string
    {
        const result = this.#extractParameters(parameters);
        
        return result.join(', ');
    }

    #extractParameters(parameters: ReflectionParameter[]): string[]
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
        
        return result;
    }

    #createArguments(parameters: ReflectionParameter[]): string
    {
        const result = this.#extractArguments(parameters);
        
        return result.join(', ');
    }

    #extractArguments(parameters: ReflectionParameter[]): string[]
    {
        const result: string[] = [];

        // Named parameters are identified by their name.
        // Destructured parameters are identified by their index.

        let index = 0;

        for (const parameter of parameters)
        {
            result.push(this.#extractArgument(index++, parameter));
        }
        
        return result;
    }

    #extractArgument(index: number, parameter: ReflectionField | ReflectionDestructuredArray | ReflectionDestructuredObject): string
    {
        if (parameter instanceof ReflectionDestructuredArray)
        {
            return this.#createArrayArgument(index, parameter);
        }
        else if (parameter instanceof ReflectionDestructuredObject)
        {
            return this.#createObjectArgument(index, parameter);
        }

        return this.#createNamedArgument(parameter);
    }

    #createNamedArgument(parameter: ReflectionField): string
    {
        return `'${parameter.name}': ${parameter.name}`;
    }

    #createArrayArgument(index: number, parameter: ReflectionDestructuredArray): string
    {
        const members = this.#extractArguments(parameter.members).join('}, {');

        return `'$${index}': [{${members}}]`;
    }

    #createObjectArgument(index: number, parameter: ReflectionDestructuredObject): string
    {
        const members = this.#createArguments(parameter.members);

        return `'$${index}': {${members}}`;
    }
}
