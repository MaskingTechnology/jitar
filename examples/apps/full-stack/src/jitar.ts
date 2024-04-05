
import { buildServer } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);
const server = await buildServer(moduleImporter);

process.on('SIGINT', async () => server.stop());

server.start();
