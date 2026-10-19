
import FileManager from './FileManager';
import LocalFileSystem from './LocalFileSystem';

export default class LocalFileManager extends FileManager
{
    constructor(location: string, root?: string)
    {
        super(new LocalFileSystem(), location, root);
    }
}
