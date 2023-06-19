
import { buildServer } from 'jitar';

import LoggingMiddleware from './LoggingMiddleware.js';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await buildServer(moduleImporter);
server.addMiddleware(new LoggingMiddleware());
server.start();
