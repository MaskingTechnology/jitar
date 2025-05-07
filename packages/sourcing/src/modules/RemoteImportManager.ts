
import ImportManager from './ImportManager';
import RemoteModuleLocator from './RemoteModuleLocator';

export default class RemoteImportManager extends ImportManager
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(location: string)
    {
        super(new RemoteModuleLocator(location));
    }
}
