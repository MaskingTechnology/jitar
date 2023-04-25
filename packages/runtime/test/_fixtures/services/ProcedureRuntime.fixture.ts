
import Version from '../../../src/models/Version';
import ProcedureRuntime from '../../../src/services/ProcedureRuntime';

import { MIDDLEWARES } from '../interfaces/Middleware.fixture';

class MiddlewareRuntime extends ProcedureRuntime
{
    getProcedureNames(): string[] { return []; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasProcedure(name: string): boolean { return false; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown> { return null; }
}

const middlewareRuntime = new MiddlewareRuntime();
middlewareRuntime.addMiddleware(MIDDLEWARES.FIRST);
middlewareRuntime.addMiddleware(MIDDLEWARES.SECOND);
middlewareRuntime.addMiddleware(MIDDLEWARES.THIRD);

const RUNTIMES =
{
    MIDDLEWARE: middlewareRuntime
};

export { RUNTIMES };
