
import { startServer, CorsMiddleware } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await startServer(moduleImporter);
server.addMiddleware(new CorsMiddleware('http://localhost:8080'));
