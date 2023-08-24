
import RuntimeNotAvailable from '../errors/RuntimeNotAvailable.js';

import Request from '../models/Request.js';
import VersionParser from '../utils/VersionParser.js';

import LocalNode from '../services/LocalNode.js';

let _runtime: LocalNode;

export function setRuntime(runtime: LocalNode): void
{
    _runtime = runtime;
}

export async function runProcedure(fqn: string, versionNumber: string, args: object, sourceRequest?: Request): Promise<unknown>
{
    if (_runtime === undefined)
    {
        throw new RuntimeNotAvailable();
    }

    const version = VersionParser.parse(versionNumber);
    const argsMap = new Map<string, unknown>(Object.entries(args));
    const headersMap = sourceRequest instanceof Request ? sourceRequest.headers : new Map();

    const targetRequest = new Request(fqn, version, argsMap, headersMap);

    return _runtime.run(targetRequest);
}
