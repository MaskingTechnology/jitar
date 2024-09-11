
import { Request, RunModes, StatusCodes, VersionParser, ProcedureNotAccessible } from '@jitar/execution';
import { RunnerService } from '@jitar/services';

export default class Runtime
{
    #runner: RunnerService;

    constructor(runner: RunnerService)
    {
        this.#runner = runner;

        const globals = globalThis as Record<string, unknown>;
        globals.__run = this.#run.bind(this);
        globals.ProcedureNotAccessible = ProcedureNotAccessible;
    }

    async #run(fqn: string, versionNumber: string, args: Record<string, unknown>, sourceRequest?: Request): Promise<unknown>
    {
        // This function is called from the remote implementations

        const version = VersionParser.parse(versionNumber);
        const argsMap = new Map<string, unknown>(Object.entries(args));
        const headersMap = sourceRequest instanceof Request ? sourceRequest.headers : new Map();
        const trustKey = ''; // TODO: get trust key from runner and add to headers

        const targetRequest = new Request(fqn, version, argsMap, headersMap, RunModes.NORMAL);
        const targetResponse = await this.#runner.run(targetRequest);

        if (targetResponse.status !== StatusCodes.OK)
        {
            throw targetResponse.result;
        }
        
        return targetResponse.result;
    }
}
