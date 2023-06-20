
import { buildServer } from 'jitar';

import DatabaseHealthCheck from './DatabaseHealthCheck.js';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await buildServer(moduleImporter);
server.registerHealthCheck('database', new DatabaseHealthCheck());
server.start();
