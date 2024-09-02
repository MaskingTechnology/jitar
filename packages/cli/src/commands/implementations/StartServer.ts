
import { ConfigurationManager, RuntimeConfiguration } from '@jitar/configuration';
import { FileManagerBuilder, Module, ImportFunction } from '@jitar/sourcing'; // Via runtime?
import { Server } from '@jitar/services';
import { buildServer } from '@jitar/runtime';
import { HttpServer } from '@jitar/server-http';

import Command from '../interfaces/Command';

export default class StartServer implements Command
{
    async execute(args: Map<string, string>): Promise<void>
    {
        const server = await this.#buildServer();
        const httpServer = new HttpServer(server, '3000');

        process.on('SIGINT', async () => httpServer.stop());

        return httpServer.start();
    }

    async #buildServer(): Promise<Server>
    {
        const configurationManager = new ConfigurationManager();
        
        const runtimeConfiguration = await configurationManager.configureRuntime();
        const serverConfiguration = await configurationManager.configureServer('./services/standalone.json');

        const importFunction = await this.#getImportFunction(runtimeConfiguration);

        return buildServer(runtimeConfiguration, serverConfiguration, importFunction);
    }

    async #getImportFunction(configuration: RuntimeConfiguration): Promise<ImportFunction>
    {
        const fileManager = new FileManagerBuilder('./').buildLocal(configuration.target);

        const filename = fileManager.getAbsoluteLocation('jitar.js');
        const module = await import(filename) as Module;

        return module.default as ImportFunction;
    }
}
