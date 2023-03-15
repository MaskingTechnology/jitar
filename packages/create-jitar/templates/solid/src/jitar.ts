
import { startServer } from 'jitar-nodejs-server';

const moduleImporter = async (specifier: string) => import(specifier);

startServer(moduleImporter);
