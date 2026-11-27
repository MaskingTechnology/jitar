
import path from 'node:path';

import type { FileSystem } from '@jitar/sourcing';

export default class TestFileSystem implements FileSystem
{
    readonly #root: string;
    readonly #directories: Set<string>;

    constructor(root: string, directories: readonly string[] = [])
    {
        this.#root = path.posix.normalize(root);

        this.#directories = new Set(directories.map(directory => path.posix.join(this.#root, directory)));
    }

    async copy(source: string, destination: string): Promise<void>
    {
        // Not used by the tests.
    }

    async delete(location: string): Promise<void>
    {
        // Not used by the tests.
    }

    async exists(location: string): Promise<boolean>
    {
        return false;
    }

    async filter(location: string, pattern: string): Promise<string[]>
    {
        return [];
    }

    isAbsolute(location: string): boolean
    {
        return path.posix.isAbsolute(location);
    }

    isDirectory(location: string): boolean
    {
        return this.#directories.has(path.posix.normalize(location));
    }

    join(...paths: string[]): string
    {
        return path.posix.join(...paths);
    }

    async read(location: string): Promise<Buffer>
    {
        return Buffer.from('');
    }

    resolve(location: string): string
    {
        // The location is always joined with the root before being
        // resolved, so it is always absolute.

        return path.posix.resolve(location);
    }

    relative(from: string, to: string): string
    {
        return path.posix.relative(from, to);
    }

    normalize(location: string): string
    {
        // Mirrors the LocalFileSystem: only replaces the Windows path separator.

        return location.replaceAll('\\', '/');
    }

    async mimeType(location: string): Promise<string | undefined>
    {
        return undefined;
    }

    async write(location: string, content: string): Promise<void>
    {
        // Not used by the tests.
    }
}
