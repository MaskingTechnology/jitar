
import { startServer } from 'jitar';

const moduleImporter = async(specifier: string) => import(specifier);

startServer(moduleImporter);
