
import{ Runner, Request, Response } from '../../execution';

import Middleware from '../interfaces/Middleware';
import NextHandler from '../types/NextHandler';

export default class ProcedureRunner implements Middleware
{
    #runner: Runner;

    constructor(runner: Runner)
    {
        this.#runner = runner;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        return this.#runner.run(request);
    }
}
