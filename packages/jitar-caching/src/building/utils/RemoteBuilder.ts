
import { ReflectionField } from 'jitar-reflection';
import { AccessLevel } from 'jitar-runtime';

import SegmentImplementation from '../models/SegmentImplementation.js';
import SegmentModule from '../models/SegmentModule.js';

const KEYWORD_DEFAULT = 'default';

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

                const asDefault = implementation.importKey === KEYWORD_DEFAULT;

                code += this.#createRemoteCode(procedure.fqn, implementation, asDefault);
            }
        }

        return code;
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

        const functionName = `\nexport ${asDefault ? `${KEYWORD_DEFAULT} ` : ''}async function ${procedureName}(${procedueParameters})`;
        const functionBody = `return runProcedure('${fqn}', '${procedureVersion}', { ${procedureArguments} }, this)`;

        return `${functionName} {\n\t${functionBody}\n}\n`;
    }
}
