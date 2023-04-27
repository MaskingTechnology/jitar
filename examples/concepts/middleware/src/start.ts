
import { startServer } from 'jitar';

import LoggingMiddleware from './LoggingMiddleware.js';

const moduleImporter = async (specifier: string) => import(specifier);

// Top level await is not supported in Node.js yet,
// so we use the classic promise syntax for this case.
startServer(moduleImporter).then(server =>
{
    // When the server has started we can add one or middleware implementations.
    // Note that the execution order of the middleware is reversed.
    server.addMiddleware(new LoggingMiddleware());
});
