
import { ModuleImporter, ModuleLoader } from '@jitar/runtime';

import JitarServer from './JitarServer.js';

export async function startServer(moduleImporter: ModuleImporter): Promise<JitarServer>
{
    ModuleLoader.setImporter(moduleImporter);

    const server = new JitarServer();

    await server.start();

    return server;
}
