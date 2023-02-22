
import { startServer } from 'jitar-nodejs-server';
import { CorsMiddleware } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);

startServer(moduleImporter).then(server =>
{
    server.addMiddleware(new CorsMiddleware());
});
