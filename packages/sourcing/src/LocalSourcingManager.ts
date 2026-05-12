
import { LocalFileManager } from './files';
import { LocalImportManager } from './modules';

import SourcingManager from './SourcingManager';

export default class LocalSourcingManager extends SourcingManager
{
    constructor(location: string)
    {
        const fileManager = new LocalFileManager(location);
        const importManager = new LocalImportManager(fileManager);

        super(fileManager, importManager);
    }

    fork(location: string): LocalSourcingManager
    {
        const absoluteLocation = this.fileManager.getAbsoluteLocation(location);

        return new LocalSourcingManager(absoluteLocation);
    }
}
