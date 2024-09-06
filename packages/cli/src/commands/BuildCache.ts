
import { ConfigurationManager } from '@jitar/configuration';
import { CacheManager } from '@jitar/caching';

import Command from '../interfaces/Command';
import ArgumentManager from '../ArgumentManager';

export default class BuildCache implements Command
{
    async execute(args: ArgumentManager): Promise<void>
    {
        const configurationManager = new ConfigurationManager();
        
        const configuration = await configurationManager.configureRuntime();

        const cacheManager = new CacheManager(configuration);

        return cacheManager.build();
    }
}
