
import { RuntimeConfiguration, ServerConfiguration } from '@jitar/configuration';
import { SourcingManager, LocalFileManager } from '@jitar/sourcing';

import type Server from './server/Server';
import ServerBuilder from './server/ServerBuilder';

export default async function buildServer(runtimeConfiguration: RuntimeConfiguration, serverConfiguration: ServerConfiguration): Promise<Server>
{
    const fileManager = new LocalFileManager(runtimeConfiguration.target);
    const sourcingManager = new SourcingManager(fileManager);
    const serverBuilder = new ServerBuilder(sourcingManager);

    return serverBuilder.build(serverConfiguration);
}
