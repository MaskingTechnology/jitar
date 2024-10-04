
import { BuildManager } from '@jitar/build';
import { ConfigurationManager } from '@jitar/configuration';
import { LogLevel, LogLevelParser } from '@jitar/logging';

import ArgumentProcessor from '../ArgumentProcessor';
import Command from '../Command';

export default class BuildApp implements Command
{
    async execute(args: ArgumentProcessor): Promise<void>
    {
        const environmentFile = args.getOptionalArgument('--env-file', undefined);
        const runtimeConfigFile = args.getOptionalArgument('--config', undefined);

        const logLevelString = args.getOptionalArgument('--log-level', undefined);
        const logLevel = this.#parseLogLevel(logLevelString);

        const configurationManager = new ConfigurationManager();

        await configurationManager.configureEnvironment(environmentFile);

        const configuration = await configurationManager.getRuntimeConfiguration(runtimeConfigFile);

        const buildManager = new BuildManager(configuration, logLevel);

        return buildManager.build();
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
