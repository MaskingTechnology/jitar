
import { RuntimeConfiguration, ServerConfiguration } from '@jitar/configuration';
import { SourcingManager, ImportFunction, FileManagerBuilder } from '@jitar/sourcing';
import type { Server } from '@jitar/services';

import RuntimeBuilder from './build/RuntimeBuilder';

import { setRuntime } from './hooks';

export default async function buildServer(runtimeConfiguration: RuntimeConfiguration, serverConfiguration: ServerConfiguration, importFunction: ImportFunction): Promise<Server>
{
    const fileManager = new FileManagerBuilder(runtimeConfiguration.target).buildLocal();
    const sourcingManager = new SourcingManager(fileManager, importFunction);
    const runtimeBuilder = new RuntimeBuilder(sourcingManager);

    const server = await runtimeBuilder.buildServer(serverConfiguration);

    setRuntime(server);

    return server;
}
