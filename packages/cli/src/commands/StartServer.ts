
import { ConfigurationManager } from '@jitar/configuration';
import { buildServer } from '@jitar/runtime';
import { HttpServer } from '@jitar/server-http';

import Command from '../interfaces/Command';
import ArgumentManager from '../ArgumentManager';

export default class StartServer implements Command
{
    async execute(args: ArgumentManager): Promise<void>
    {
        const configurationFile = args.getRequiredArgument('--config');

        const httpServer = await this.#buildServer(configurationFile);

        return this.#runServer(httpServer);        
    }

    async #buildServer(configurationFile: string): Promise<HttpServer>
    {
        const configurationManager = new ConfigurationManager();
        
        const runtimeConfiguration = await configurationManager.configureRuntime();
        const serverConfiguration = await configurationManager.configureServer(configurationFile);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [protocol, host, port] = serverConfiguration.url.split(':');

        const server = await buildServer(runtimeConfiguration, serverConfiguration);

        return new HttpServer(server, port)
    }

    #runServer(httpServer: HttpServer): Promise<void>
    {
        process.on('SIGINT', async () => httpServer.stop());

        return httpServer.start();
    }
}
