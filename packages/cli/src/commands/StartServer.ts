
import { ConfigurationManager, RuntimeConfiguration, ServiceConfiguration } from '@jitar/configuration';
import { HttpRemoteBuilder, HttpServer, type HttpConfiguration } from '@jitar/http';
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
    ];

    async execute(args: ArgumentProcessor): Promise<void>
    {
        const environmentFile = args.getOptionalArgument('--env-file', undefined);
        const runtimeConfigFile = args.getOptionalArgument('--config', undefined);
        const serviceConfigFile = args.getRequiredArgument('--service');

        const logLevelString = args.getOptionalArgument('--log-level', undefined);
        const logLevel = this.#parseLogLevel(logLevelString);

        const configurationManager = new ConfigurationManager();

        await configurationManager.configureEnvironment(environmentFile);

        const runtimeConfiguration = await configurationManager.getRuntimeConfiguration(runtimeConfigFile);
        const serviceConfiguration = await configurationManager.getServiceConfiguration(serviceConfigFile);

        const httpServer = await this.#buildServer(runtimeConfiguration, serviceConfiguration, logLevel);

        return this.#runServer(httpServer);
    }

    async #buildServer(runtimeConfiguration: RuntimeConfiguration, serviceConfiguration: ServiceConfiguration, logLevel?: LogLevel): Promise<HttpServer>
    {
        const [, , port] = serviceConfiguration.url.split(':');

        const configuration: HttpConfiguration = {
            port,
            bodyLimit: serviceConfiguration.http.bodyLimit,
            proxied: serviceConfiguration.http.proxied
        };

        const sourcingManager = new LocalSourcingManager(runtimeConfiguration.target);
        const remoteBuilder = new HttpRemoteBuilder();
        const serverBuilder = new ServerBuilder(sourcingManager, remoteBuilder);

        const server = await serverBuilder.build(serviceConfiguration, logLevel);

        return new HttpServer(server, configuration);
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
}
