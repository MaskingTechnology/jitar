
import { RemoteFileManager } from './files';
import { RemoteImportManager } from './modules';

import SourcingManager from './SourcingManager';

export default class RemoteSourcingManager extends SourcingManager
{
    constructor(location: string)
    {
        const fileManager = new RemoteFileManager(location);
        const importManager = new RemoteImportManager(location);

        super(fileManager, importManager);
    }
}
