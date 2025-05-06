
import type { LocalFileManager } from '../files';

import ImportManager from './ImportManager';
import LocalModuleLocator from './LocalModuleLocator';

export default class LocalImportManager extends ImportManager
{
    constructor(fileManager: LocalFileManager)
    {
        super(new LocalModuleLocator(fileManager));
    }
}
