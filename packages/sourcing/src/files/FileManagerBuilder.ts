
import FileManager from './interfaces/FileManager';

import LocalFileManager from './implementations/LocalFileManager';
import RemoteFileManager from './implementations/RemoteFileManager';

export default class FileManagerBuilder
{
    #root: string;

    constructor(root: string)
    {
        this.#root = root.endsWith('/') ? root.slice(0, -1) : root;
    }

    buildLocal(path?: string): FileManager
    {
        const location = this.#createLocation(path);

        return new LocalFileManager(location);
    }

    buildRemote(path?: string): FileManager
    {
        const location = this.#createLocation(path);

        return new RemoteFileManager(location);
    }

    #createLocation(path?: string): string
    {
        if (path === undefined)
        {
            return this.#root;
        }

        if (path.startsWith('/'))
        {
            return path;
        }

        if (path.startsWith('./'))
        {
            return `${this.#root}/${path.slice(2)}`;
        }

        if (path.startsWith('../'))
        {
            throw new Error('Relative paths with ".." are not supported');
        }

        return `${this.#root}/${path}`;
    }
}
