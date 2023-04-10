
import { startServer } from 'jitar-nodejs-server';

const moduleImporter = async (specifier) => import(specifier);

startServer(moduleImporter);
