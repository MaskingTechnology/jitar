
import Version from '../core/Version.js';

import Runtime from './Runtime.js';
import Middleware from './interfaces/Middleware.js';
import NextHandler from './types/NextHandler.js';
import ProcedureRunner from './ProcedureRunner.js';
import Runner from '../core/interfaces/Runner.js';

export default abstract class ProcedureRuntime extends Runtime implements Runner
{
    #middlewares: Middleware[] = [];

    constructor(url?: string)
    {
        super(url);

        this.addMiddleware(new ProcedureRunner(this));
    }

    abstract getProcedureNames(): string[];

    abstract hasProcedure(name: string): boolean;

    abstract run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>;

    addMiddleware(middleware: Middleware)
    {
        this.#middlewares.push(middleware);
    }

    handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        const startHandler = this.#getNextHandler(fqn, version, args, headers, 0);

        return startHandler();
    }

    #getNextHandler(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, index: number): NextHandler
    {
        // Reverse the index so that the first middleware added is the last one to be called
        const indexFromEnd = this.#middlewares.length - index - 1;
        const next = this.#middlewares[indexFromEnd];

        if (next === undefined)
        {
            return async () => {};
        }

        const nextHandler = this.#getNextHandler(fqn, version, args, headers, index + 1);

        return async () => { return next.handle(fqn, version, args, headers, nextHandler); }
    }
}
