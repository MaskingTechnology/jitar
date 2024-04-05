
import RuntimeNotAvailable from './errors/RuntimeNotAvailable.js';
import Import from './models/Import.js';
import Request from './models/Request.js';
import ProcedureRuntime from './services/ProcedureRuntime.js';
import VersionParser from './utils/VersionParser.js';
import Environment from './utils/Environment.js';
import { ExecutionScope } from './lib.js';

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

export async function importModule(caller: string, specifier: string, executionScope: ExecutionScope, extractDefault: boolean): Promise<unknown>
{
    const runtime = getRuntime();
    
    if (Environment.isBrowser() && specifier === 'JITAR_LIBRARY_NAME')
    {
        specifier = 'RUNTIME_HOOKS_LOCATION';
    }

    const importModel = new Import(caller, specifier, executionScope, extractDefault);
    const module = await runtime.import(importModel);

    return importModel.extractDefault && module.default !== undefined ? module.default : module;
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
