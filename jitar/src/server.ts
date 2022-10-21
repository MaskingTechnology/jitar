
import ModuleImporter from './runtime/types/ModuleImporter.js';
import ModuleLoader from './runtime/utils/ModuleLoader.js';

import JitarServer from './server/JitarServer.js';

export async function startServer(moduleImporter: ModuleImporter): Promise<JitarServer>
{
    ModuleLoader.setImporter(moduleImporter);

    const server = new JitarServer();

    await server.start();

    return server;
}
