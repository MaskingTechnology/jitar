
import ImportManager from './ImportManager';
import RemoteModuleLocator from './RemoteModuleLocator';

export default class LocalImportManager extends ImportManager
{
    constructor(location: string)
    {
        super(new RemoteModuleLocator(location));
    }
}
