
import Version from '../core/Version.js';

import Middleware from './interfaces/Middleware.js';
import ProcedureRuntime from './ProcedureRuntime.js';
import NextHandler from './types/NextHandler.js';

export default class ProcedureRunner implements Middleware
{
    #runner: ProcedureRuntime;

    constructor(runner: ProcedureRuntime)
    {
        this.#runner = runner;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>
    {
        const result = this.#runner.run(fqn, version, args, headers);

        headers.clear();

        return result;
    }
}
