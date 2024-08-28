
import { ConfigurationManager } from '@jitar/configuration';
import { CacheManager } from '@jitar/caching';

import Command from '../interfaces/Command';

export default class BuildCache implements Command
{
    async execute(args: Map<string, string>): Promise<void>
    {
        const configurationManager = new ConfigurationManager();
        
        const configuration = await configurationManager.configure();

        const cacheManager = new CacheManager(configuration);

        return cacheManager.build();
    }
}
