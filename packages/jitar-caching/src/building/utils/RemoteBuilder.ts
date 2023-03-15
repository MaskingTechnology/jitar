
import { ReflectionArray, ReflectionField, ReflectionFunction, ReflectionObject } from 'jitar-reflection';
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
        const parameters = this.#createParameters(implementation.executable);
        const argumentz = this.#createArguments(implementation.executable);

        const functionName = `\nexport ${asDefault ? `${Keyword.DEFAULT} ` : ''}async function ${name}(${parameters})`;
        const functionBody = `return runProcedure('${fqn}', '${version}', { ${argumentz} }, this)`;

        return `${functionName} {\n\t${functionBody}\n}\n`;
    }

    #createParameters(executable: ReflectionFunction): string
    {
        const result: string[] = [];

        for (const parameter of executable.parameters)
        {
            if (parameter instanceof ReflectionField)
            {
                result.push(parameter.name);
            }
            else if (parameter instanceof ReflectionArray)
            {
                result.push(parameter.toString()); // Unsupported for now
            }
            else if (parameter instanceof ReflectionObject)
            {
                result.push(parameter.toString()); // Unsupported for now
            }
        }
        
        return result.join(', ');
    }

    #createArguments(executable: ReflectionFunction): string
    {
        const result: string[] = [];

        let number = 0;

        for (const parameter of executable.parameters)
        {
            if (parameter instanceof ReflectionField)
            {
                result.push(`'${parameter.name}': ${parameter.name}`);
            }
            else if (parameter instanceof ReflectionArray)
            {
                result.push(`'\$${number++}': []`); // Unsupported for now
            }
            else if (parameter instanceof ReflectionObject)
            {
                result.push(`'\$${number++}': {}`); // Unsupported for now
            }
        }
        
        return result.join(', ');
    }
}
