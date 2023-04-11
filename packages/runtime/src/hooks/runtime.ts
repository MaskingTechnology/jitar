
import Context from '../models/Context.js';
import VersionParser from '../utils/VersionParser.js';

import RuntimeNotAvailable from '../errors/RuntimeNotAvailable.js';
import LocalNode from '../services/LocalNode.js';

let _runtime: LocalNode;

export function setRuntime(runtime: LocalNode): void
{
    _runtime = runtime;
}

export async function runProcedure(fqn: string, versionNumber: string, args: object, context?: object): Promise<unknown>
{
    if (_runtime === undefined)
    {
        throw new RuntimeNotAvailable();
    }

    const version = VersionParser.parse(versionNumber);
    const argsMap = new Map<string, unknown>(Object.entries(args));
    const headersMap = context instanceof Context ? context.headers : new Map();

    return _runtime.run(fqn, version, argsMap, headersMap);
}
