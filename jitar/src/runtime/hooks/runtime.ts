
import Version from '../../core/Version.js';

import RuntimeNotAvailable from '../errors/RuntimeNotAvailable.js';
import LocalNode from '../LocalNode.js';

let _runtime: LocalNode;

export function setRuntime(runtime: LocalNode): void
{
    _runtime = runtime;
}

export async function runProcedure(fqn: string, versionNumber: string, args: object): Promise<unknown>
{
    if (_runtime === undefined)
    {
        throw new RuntimeNotAvailable();
    }

    const version = Version.parse(versionNumber);
    const argsMap = new Map<string, unknown>(Object.entries(args));

    return _runtime.run(fqn, version, argsMap);
}
