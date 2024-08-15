
import RuntimeNotAvailable from './errors/RuntimeNotAvailable.js';
import Request from './models/Request.js';
import ProcedureRuntime from './services/ProcedureRuntime.js';
import VersionParser from './utils/VersionParser.js';

let _runtime: ProcedureRuntime;

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
    const targetResponse = await runtime.handle(targetRequest);

    return targetResponse.result;
}
