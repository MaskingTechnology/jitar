
import { startServer } from 'jitar';

const moduleImporter = async (specifier) => import(specifier);

startServer(moduleImporter);
