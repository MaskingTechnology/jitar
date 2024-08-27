
import { LocalFileManager } from '@jitar/server-nodejs';
import { CacheManager } from '@jitar/caching';

import Command from '../interfaces/Command';

export default class BuildCache implements Command
{
    async execute(args: Map<string, string>): Promise<void>
    {
        const projectFileManager = new LocalFileManager('./');
        const appFileManager = new LocalFileManager('./dist');

        const cacheManager = new CacheManager(projectFileManager, appFileManager);
        cacheManager.build();
    }
}
