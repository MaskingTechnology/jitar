
import FileManager from './FileManager';
import RemoteFileSystem from './RemoteFileSystem';

export default class RemoteFileManager extends FileManager
{
    constructor(location: string, root?: string)
    {
        super(new RemoteFileSystem(), location, root);
    }
}
