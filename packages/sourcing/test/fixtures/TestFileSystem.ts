
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

    // eslint-disable-next-line no-unused-vars
    async filter(location: string, pattern: string): Promise<string[]>
    {
        return [
            path.join(this.#root, 'file1.txt'),
            path.join(this.#root, './aaa/file2.txt'),
            path.join(this.#root, './bbb/file3.txt'),
        ]
    }

    async mimeType(location: string): Promise<string | undefined>
    {
        return location.endsWith('.txt') ? 'text/plain' : undefined;
    }

    // eslint-disable-next-line no-unused-vars
    relative(from: string, to: string): string
    {
        return path.relative(this.#root, to);
    }

    resolve(location: string): string
    {
        return path.resolve(this.#root, location);
    }
}
