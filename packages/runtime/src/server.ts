
import { RuntimeConfiguration, ServerConfiguration } from '@jitar/configuration';
import { SourcingManager, LocalFileManager } from '@jitar/sourcing';
import { ServerBuilder } from '@jitar/services';
import type { Server } from '@jitar/services';

import { setRunner } from './hooks';

export default async function buildServer(runtimeConfiguration: RuntimeConfiguration, serverConfiguration: ServerConfiguration): Promise<Server>
{
    const fileManager = new LocalFileManager(runtimeConfiguration.target);
    const sourcingManager = new SourcingManager(fileManager);
    const serverBuilder = new ServerBuilder(sourcingManager);

    const server = await serverBuilder.build(serverConfiguration);

    setRunner(server.proxy.runner);

    return server;
}
