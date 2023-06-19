
import { buildServer, CorsMiddleware } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await buildServer(moduleImporter);

server.addMiddleware(new CorsMiddleware('http://localhost:8080'));

server.start();
