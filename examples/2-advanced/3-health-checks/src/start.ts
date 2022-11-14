
import { startServer } from 'jitar-nodejs-server';

import DatabaseHealthCheck from './DatabaseHealthCheck.js';

const moduleImporter = async (specifier: string) => import(specifier);

// Top level await is not supported in Node.js yet,
// so we use the classic promise syntax for this case.
startServer(moduleImporter).then(server =>
{
    // When the server has started we can add one or more health checks.
    // The name is used to identify its status in the health check API.
    server.addHealthCheck('database', new DatabaseHealthCheck());
});
