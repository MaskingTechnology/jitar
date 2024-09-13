
import { Request, RunModes, StatusCodes, VersionParser, ProcedureNotAccessible } from '@jitar/execution';
import { RunnerService } from '@jitar/services';

export default class Runtime
{
    #runner: RunnerService;

    constructor(runner: RunnerService)
    {
        this.#runner = runner;

        this.#initGlobals();
    }

    #initGlobals(): void
    {
        // These globals are only used by the remote implementations.
        // The reason we use them is to decouple the runtime from the remote implementations.
        // This way, remote implementations can be bundled separately from Jitar.

        const globals = globalThis as Record<string, unknown>;
        globals.__run = this.#run.bind(this);
        globals.ProcedureNotAccessible = ProcedureNotAccessible;
    }

    async #run(fqn: string, versionNumber: string, args: Record<string, unknown>, sourceRequest?: Request): Promise<unknown>
    {
        const version = VersionParser.parse(versionNumber);
        const argsMap = new Map<string, unknown>(Object.entries(args));
        const headersMap = sourceRequest instanceof Request ? sourceRequest.headers : new Map();

        const targetRequest = new Request(fqn, version, argsMap, headersMap, RunModes.NORMAL);

        if (this.#runner.trustKey !== undefined)
        {
            targetRequest.setHeader('X-Jitar-Trust-Key', this.#runner.trustKey);
        }

        const targetResponse = await this.#runner.run(targetRequest);

        if (targetResponse.status !== StatusCodes.OK)
        {
            throw targetResponse.result;
        }
        
        return targetResponse.result;
    }
}
