
import { ConfigurationManager } from '@jitar/configuration';
import { CacheManager } from '@jitar/build';

import Command from '../interfaces/Command';
import ArgumentManager from '../ArgumentManager';

export default class BuildCache implements Command
{
    async execute(args: ArgumentManager): Promise<void>
    {
        const environmentFile = args.getOptionalArgument('--env-file', undefined);
        const runtimeConfigFile = args.getOptionalArgument('--config', undefined);

        const configurationManager = new ConfigurationManager();

        await configurationManager.configureEnvironment(environmentFile);
        
        const configuration = await configurationManager.getRuntimeConfiguration(runtimeConfigFile);

        const cacheManager = new CacheManager(configuration);

        return cacheManager.build();
    }
}
