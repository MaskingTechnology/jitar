
import path from 'path';

import LocalFileSystem from '../../src/LocalFileSystem';

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

    resolve(location: string): string
    {
        return path.resolve(this.#root, location);
    }

    async mimeType(location: string): Promise<string | undefined>
    {
        return location.endsWith('.txt') ? 'text/plain' : undefined;
    }
}
