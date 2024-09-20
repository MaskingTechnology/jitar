
import { Request, Response, RunModes, StatusCodes, VersionParser, ProcedureNotAccessible } from '@jitar/execution';
import { RunnerService } from '@jitar/services';

export default abstract class Runtime
{
    constructor()
    {
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

    abstract getTrustKey(): string | undefined;

    abstract runInternal(request: Request): Promise<Response>;

    async #run(fqn: string, versionNumber: string, args: Record<string, unknown>, sourceRequest?: Request): Promise<unknown>
    {
        const version = VersionParser.parse(versionNumber);
        const argsMap = new Map<string, unknown>(Object.entries(args));
        const headersMap = sourceRequest instanceof Request ? sourceRequest.headers : new Map();

        const targetRequest = new Request(fqn, version, argsMap, headersMap, RunModes.NORMAL);
        const trustKey = this.getTrustKey();

        if (trustKey !== undefined)
        {
            targetRequest.setHeader('X-Jitar-Trust-Key', trustKey);
        }

        const targetResponse = await this.runInternal(targetRequest);

        if (targetResponse.status !== StatusCodes.OK)
        {
            throw targetResponse.result;
        }
        
        return targetResponse.result;
    }
}
