
import { startServer } from 'jitar';

import DatabaseHealthCheck from './DatabaseHealthCheck.js';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await startServer(moduleImporter);
server.addHealthCheck('database', new DatabaseHealthCheck());