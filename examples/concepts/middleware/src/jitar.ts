
import { startServer } from 'jitar';

import LoggingMiddleware from './LoggingMiddleware.js';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await startServer(moduleImporter);
server.addMiddleware(new LoggingMiddleware());
