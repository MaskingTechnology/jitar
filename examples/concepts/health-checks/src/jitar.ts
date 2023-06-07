
import { startServer } from 'jitar';

import DatabaseHealthCheck from './DatabaseHealthCheck.js';
import DatabaseHealthCheck2 from './DatabaseHealthCheck2.js';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await startServer(moduleImporter);
server.addHealthCheck('database', new DatabaseHealthCheck());
server.addHealthCheck('database2', new DatabaseHealthCheck2());