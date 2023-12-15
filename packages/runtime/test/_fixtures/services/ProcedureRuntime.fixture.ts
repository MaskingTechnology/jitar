
import Request from '../../../src/models/Request';
import Response from '../../../src/models/Response';

import ProcedureRuntime from '../../../src/services/ProcedureRuntime';

import { MIDDLEWARES } from '../interfaces/Middleware.fixture';
import { REPOSITORIES } from './LocalRepository.fixture';

class MiddlewareRuntime extends ProcedureRuntime
{
    getProcedureNames(): string[] { return []; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasProcedure(name: string): boolean { return false; }

    async start() { }

    async stop() { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(request: Request): Promise<Response> { return new Response(); }
}

const middlewareRuntime = new MiddlewareRuntime(REPOSITORIES.DUMMY);
middlewareRuntime.addMiddleware(MIDDLEWARES.FIRST);
middlewareRuntime.addMiddleware(MIDDLEWARES.SECOND);
middlewareRuntime.addMiddleware(MIDDLEWARES.THIRD);

const RUNTIMES =
{
    MIDDLEWARE: middlewareRuntime
};

export { RUNTIMES };
