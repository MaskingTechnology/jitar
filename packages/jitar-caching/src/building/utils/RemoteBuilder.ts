
import { ReflectionField } from 'jitar-reflection';
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
        const parameters = implementation.executable.parameters.filter(parameter => parameter instanceof ReflectionField) as ReflectionField[];
        const parameterNames = parameters.map(parameter => parameter.name);

        const procedureName = implementation.executable.name;
        const procedureVersion = implementation.version;
        const procedueParameters = parameterNames.join(', ');
        const procedureArguments = parameterNames.map(name => `'${name}': ${name}`).join(', ');

        const functionName = `\nexport ${asDefault ? `${Keyword.DEFAULT} ` : ''}async function ${procedureName}(${procedueParameters})`;
        const functionBody = `return runProcedure('${fqn}', '${procedureVersion}', { ${procedureArguments} }, this)`;

        return `${functionName} {\n\t${functionBody}\n}\n`;
    }
}
