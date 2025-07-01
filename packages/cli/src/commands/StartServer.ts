
import { ConfigurationManager, RuntimeConfiguration, ServerConfiguration } from '@jitar/configuration';
import { HttpRemoteBuilder, HttpServer } from '@jitar/http';
import { LogLevel, LogLevelParser } from '@jitar/logging';
import { ServerBuilder } from '@jitar/runtime';
import { LocalSourcingManager } from '@jitar/sourcing';

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
    readonly name = 'start';
    readonly description = 'Starts a server with the configured service.';
    readonly options =
    [
        { key: '--service', required: true, description: 'Path to the service configuration file' },

        { key: '--env-file', required: false, description: 'Path to the environment file' },
        { key: '--config', required: false, description: 'Path to the configuration file', defaultValue: 'jitar.json' },
        { key: '--log-level', required: false, description: 'Level of logging [info, debug, warn, error, fatal]', defaultValue: 'info' },
        { key: '--http-body-limit', required: false, description: 'Maximum HTTP body size in bytes', defaultValue: 204_800 }
    ];

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

        const sourcingManager = new LocalSourcingManager(runtimeConfiguration.target);
        const remoteBuilder = new HttpRemoteBuilder();
        const serverBuilder = new ServerBuilder(sourcingManager, remoteBuilder);

        const server = await serverBuilder.build(serverConfiguration, logLevel);

        return new HttpServer(server, port, bodyLimit);
    }

    #runServer(httpServer: HttpServer): Promise<void>
    {
        let isShuttingDown = false;

        process.on('SIGINT', async () => 
        {
            if (isShuttingDown) return;

            isShuttingDown = true;

            httpServer.stop();
        });

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

    #parseBodyLimit(bodyLimitString: string | undefined): number | undefined
    {
        const bodyLimit = Number.parseInt(bodyLimitString as string);

        return Number.isNaN(bodyLimit) ? undefined : bodyLimit;
    }
}
