
import path from 'node:path';

import LocalFileSystem from '../../src/files/LocalFileSystem';

export default class TestFileSystem extends LocalFileSystem
{
    #root: string;

    constructor(root: string)
    {
        super();

        this.#root = root;
    }

    // eslint-disable-next-line no-unused-vars
    async exists(location: string): Promise<boolean>
    {
        return false;
    }

    // eslint-disable-next-line no-unused-vars
    async filter(location: string, pattern: string): Promise<string[]>
    {
        return [
            path.join(this.#root, 'file1.txt'),
            path.join(this.#root, './aaa/file2.txt'),
            path.join(this.#root, './bbb/file3.txt'),
        ]
    }

    join(...paths: string[]): string
    {
        return path.join(...paths);
    }

    async mimeType(location: string): Promise<string | undefined>
    {
        if (location.endsWith('.txt')) return 'text/plain';
        // Add more if needed

        return undefined;
    }

    // eslint-disable-next-line no-unused-vars
    relative(from: string, to: string): string
    {
        if (from.charAt(1) === ':' && to.charAt(1) === ':' && from.charAt(0) !== to.charAt(0))
        {
            // Windows paths, with a drive letter change
            // Node returns the 'to' path in this situation
            
            return to;
        }

        return path.relative(from, to);
    }

    resolve(location: string): string
    {
        return this.isAbsolute(location) ? location : this.join(this.#root, location);
    }

    isAbsolute(location: string): boolean
    {
        if (location.charAt(0) === '/') return true; // POSIX root
        if (location.charAt(1) === ':') return true; // Windows root

        return false;
    }
}
