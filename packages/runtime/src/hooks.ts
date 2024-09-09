
import { ServerError } from '@jitar/errors';
import { Runner, Request, VersionParser, StatusCodes } from '@jitar/execution';

let _runner: Runner;

export class RuntimeNotAvailable extends ServerError
{
    constructor()
    {
        super(`Runtime not available`);
    }
}

export function setRunner(runner: Runner): void
{
    _runner = runner;
}

export async function runProcedure(fqn: string, versionNumber: string, args: Record<string, unknown>, sourceRequest?: Request): Promise<unknown>
{
    const runtime = getRunner();

    const version = VersionParser.parse(versionNumber);
    const argsMap = new Map<string, unknown>(Object.entries(args));
    const headersMap = sourceRequest instanceof Request ? sourceRequest.headers : new Map();

    const targetRequest = new Request(fqn, version, argsMap, headersMap);
    const targetResponse = await runtime.run(targetRequest);

    if (targetResponse.status !== StatusCodes.OK)
    {
        throw targetResponse.result;
    }
    
    return targetResponse.result;
}

function getRunner(): Runner
{
    if (_runner === undefined)
    {
        throw new RuntimeNotAvailable();
    }

    return _runner;
}
