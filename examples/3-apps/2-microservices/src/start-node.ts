
import { startServer } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);

startServer(moduleImporter).then(server =>
{
    //server.addMiddleware(new CorsMiddleware());
});
