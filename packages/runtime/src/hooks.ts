
import { ServerError } from './errors';

import Request from './execution/models/Request.js';
import ProcedureRuntime from './services/RunnerService.js';
import VersionParser from './execution/utils/VersionParser.js';

let _runtime: ProcedureRuntime;

export class RuntimeNotAvailable extends ServerError
{
    constructor()
    {
        super(`Runtime not available`);
    }
}

export function setRuntime(runtime: ProcedureRuntime): void
{
    _runtime = runtime;
}

export function getRuntime(): ProcedureRuntime
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
