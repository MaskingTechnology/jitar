
import { ModuleImporter, ModuleLoader } from 'npm:jitar@^0.2.0';

import JitarServer from './JitarServer.ts';

export async function startServer(moduleImporter: ModuleImporter): Promise<JitarServer>
{
    ModuleLoader.setImporter(moduleImporter);

    const server = new JitarServer();

    await server.start();

    return server;
}
