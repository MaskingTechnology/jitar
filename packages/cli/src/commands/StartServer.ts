
import { ConfigurationManager, RuntimeConfiguration, ServerConfiguration } from '@jitar/configuration';
import { HttpRemoteBuilder, HttpServer } from '@jitar/http';
import { LogLevel, LogLevelParser } from '@jitar/logging';
import { ServerBuilder } from '@jitar/runtime';
import { LocalFileManager, SourcingManager } from '@jitar/sourcing';

import ArgumentProcessor from '../ArgumentProcessor';
import Command from '../Command';

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
    async execute(args: ArgumentProcessor): Promise<void>
    {
        const environmentFile = args.getOptionalArgument('--env-file', undefined);
        const runtimeConfigFile = args.getOptionalArgument('--config', undefined);
        const serviceConfigFile = args.getRequiredArgument('--service');

        const logLevelString = args.getOptionalArgument('--log-level', undefined);
        const logLevel = this.#parseLogLevel(logLevelString);

        const bodyLimitString = args.getOptionalArgument('--http-body-limit', undefined);
        const bodyLimit = this.#parseBodyLimit(bodyLimitString);

        const configurationManager = new ConfigurationManager();

        await configurationManager.configureEnvironment(environmentFile);

        const runtimeConfiguration = await configurationManager.getRuntimeConfiguration(runtimeConfigFile);
        const serverConfiguration = await configurationManager.getServerConfiguration(serviceConfigFile);

        const httpServer = await this.#buildServer(runtimeConfiguration, serverConfiguration, bodyLimit, logLevel);

        return this.#runServer(httpServer);
    }

    async #buildServer(runtimeConfiguration: RuntimeConfiguration, serverConfiguration: ServerConfiguration, bodyLimit?: number, logLevel?: LogLevel): Promise<HttpServer>
    {
        const [, , port] = serverConfiguration.url.split(':');

        const fileManager = new LocalFileManager(runtimeConfiguration.target);
        const sourcingManager = new SourcingManager(fileManager);
        const remoteBuilder = new HttpRemoteBuilder();
        const serverBuilder = new ServerBuilder(sourcingManager, remoteBuilder);

        const server = await serverBuilder.build(serverConfiguration, logLevel);

        return new HttpServer(server, port, bodyLimit);
    }

    #runServer(httpServer: HttpServer): Promise<void>
    {
        process.on('SIGINT', async () => httpServer.stop());

        console.log(banner);

        return httpServer.start();
    }

    #parseLogLevel(logLevel: string | undefined): LogLevel | undefined
    {
        if (logLevel === undefined)
        {
            return;
        }

        const logLevelParser = new LogLevelParser();

        return logLevelParser.parse(logLevel);
    }

    #parseBodyLimit(bodyLimit: string | undefined): number | undefined
    {
        if (Number.isInteger(bodyLimit) === false)
        {
            return undefined;
        }

        return Number.parseInt(bodyLimit as string);
    }
}
