
import { ModuleImporter, ModuleLoader } from '@jitar/runtime';

import JitarServer from './JitarServer.js';

export async function buildServer(moduleImporter: ModuleImporter): Promise<JitarServer>
{
    ModuleLoader.setImporter(moduleImporter);

    const server = new JitarServer();

    await server.build();

    return server;
}
