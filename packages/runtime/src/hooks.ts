
import { ServerError } from './errors';
import { Runner } from './execution';

import Request from './execution/models/Request.js';
import VersionParser from './execution/utils/VersionParser.js';

let _runtime: Runner;

export class RuntimeNotAvailable extends ServerError
{
    constructor()
    {
        super(`Runtime not available`);
    }
}

export function setRuntime(runtime: Runner): void
{
    _runtime = runtime;
}

export function getRuntime(): Runner
{
    if (_runtime === undefined)
    {
        throw new RuntimeNotAvailable();
    }

    return _runtime;
}

export async function runProcedure(fqn: string, versionNumber: string, args: object, sourceRequest?: Request): Promise<unknown>
{
    const runtime = getRuntime();

    const version = VersionParser.parse(versionNumber);
    const argsMap = new Map<string, unknown>(Object.entries(args));
    const headersMap = sourceRequest instanceof Request ? sourceRequest.headers : new Map();

    const targetRequest = new Request(fqn, version, argsMap, headersMap);
    const targetResponse = await runtime.run(targetRequest);

    return targetResponse.result;
}
