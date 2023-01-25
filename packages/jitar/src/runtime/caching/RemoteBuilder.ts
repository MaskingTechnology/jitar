
import * as AccessLevel from '../../core/definitions/AccessLevel.js';
import ReflectionHelper from '../../core/reflection/ReflectionHelper.js';

import Implementation from './models/Implementation.js';
import SegmentModule from './models/SegmentModule.js';
import * as Keywords from './definitions/Keywords.js';

export default class RemoteBuilder
{
    static build(module: SegmentModule): string
    {
        let code = this.#createRemoteImports();

        for (const [importKey, implementation] of module.implementations)
        {
            if (implementation.access !== AccessLevel.PUBLIC)
            {
                continue;
            }

            const asDefault = importKey === Keywords.DEFAULT;

            code += this.#createRemoteCode(implementation, asDefault);
        }

        return code;
    }

    static #createRemoteImports(): string
    {
        return `import { runProcedure } from "/jitar/hooks.js";\n`;
    }

    static #createRemoteCode(implementation: Implementation, asDefault: boolean): string
    {
        const parameters = ReflectionHelper.getFunctionParameters(implementation.executable as Function);
        const parameterNames = parameters.map(parameter => parameter.name);

        const procedureName = implementation.executable.name;
        const procedureFqn = implementation.fqn;
        const procedureVersion = implementation.version;
        const procedueParameters = parameterNames.join(', ');
        const procedureArguments = parameterNames.map(name => `'${name}': ${name}`).join(', ');

        const functionName = `\nexport ${asDefault ? `${Keywords.DEFAULT} ` : ''}async function ${procedureName}(${procedueParameters})`;
        const functionBody = `return runProcedure('${procedureFqn}', '${procedureVersion}', { ${procedureArguments} }, this)`;

        return `${functionName} {\n\t${functionBody}\n}\n`;
    }
}
