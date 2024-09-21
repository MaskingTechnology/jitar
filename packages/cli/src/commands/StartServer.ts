
import { ConfigurationManager, RuntimeConfiguration, ServerConfiguration } from '@jitar/configuration';
import { LocalFileManager, SourcingManager } from '@jitar/sourcing';
import { ServerBuilder } from '@jitar/runtime';
import { HttpServer, HttpRemoteBuilder } from '@jitar/http';

import Command from '../interfaces/Command';
import ArgumentManager from '../ArgumentManager';

const banner = `
     ██╗██╗████████╗ █████╗ ██████╗ 
     ██║██║╚══██╔══╝██╔══██╗██╔══██╗
     ██║██║   ██║   ███████║██████╔╝
██   ██║██║   ██║   ██╔══██║██╔══██╗
╚█████╔╝██║   ██║   ██║  ██║██║  ██║
 ╚════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
 ~ Distributed JavaScript Runtime ~
____________________________________
`;

export default class StartServer implements Command
{
    async execute(args: ArgumentManager): Promise<void>
    {
        const environmentFile = args.getOptionalArgument('--env-file', undefined);
        const runtimeConfigFile = args.getOptionalArgument('--config', undefined);
        const serviceConfigFile = args.getRequiredArgument('--service');

        const configurationManager = new ConfigurationManager();

        await configurationManager.configureEnvironment(environmentFile);

        const runtimeConfiguration = await configurationManager.getRuntimeConfiguration(runtimeConfigFile);
        const serverConfiguration = await configurationManager.getServerConfiguration(serviceConfigFile);

        const httpServer = await this.#buildServer(runtimeConfiguration, serverConfiguration);

        return this.#runServer(httpServer);        
    }

    async #buildServer(runtimeConfiguration: RuntimeConfiguration, serverConfiguration: ServerConfiguration): Promise<HttpServer>
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [protocol, host, port] = serverConfiguration.url.split(':');

        const fileManager = new LocalFileManager(runtimeConfiguration.target);
        const sourcingManager = new SourcingManager(fileManager);
        const remoteBuilder = new HttpRemoteBuilder();
        const serverBuilder = new ServerBuilder(sourcingManager, remoteBuilder);

        const server = await serverBuilder.build(serverConfiguration);

        return new HttpServer(server, port);
    }

    #runServer(httpServer: HttpServer): Promise<void>
    {
        process.on('SIGINT', async () => httpServer.stop());

        console.log(banner);

        return httpServer.start();
    }
}
