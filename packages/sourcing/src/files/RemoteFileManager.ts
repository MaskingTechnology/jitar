
import FileManager from './FileManager';
import RemoteFileSystem from './RemoteFileSystem';

export default class RemoteFileManager extends FileManager
{
    constructor(location: string)
    {
        super(location, new RemoteFileSystem());
    }
}
