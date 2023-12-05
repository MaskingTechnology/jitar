
import Middleware from '../interfaces/Middleware.js';
import Request from '../models/Request.js';
import Response from '../models/Response.js';
import NextHandler from '../types/NextHandler.js';

import ProcedureRuntime from './ProcedureRuntime.js';

export default class ProcedureRunner implements Middleware
{
    #runner: ProcedureRuntime;

    constructor(runner: ProcedureRuntime)
    {
        this.#runner = runner;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        return this.#runner.run(request);
    }
}
