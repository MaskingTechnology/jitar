
import fs from 'fs-extra';
import { glob } from 'glob';
import mime from 'mime-types';
import path from 'path';

import FileSystem from './interfaces/FileSystem';

export default class LocalFileSystem implements FileSystem
{
    copy(source: string, destination: string): Promise<void>
    {
        return fs.copy(source, destination, { overwrite: true });
    }

    delete(location: string): Promise<void>
    {
        return fs.remove(location);
    }

    exists(location: string): Promise<boolean>
    {
        return fs.exists(location);
    }

    filter(location: string, pattern: string): Promise<string[]>
    {
        return glob(`${location}/${pattern}`);
    }

    join(...paths: string[]): string
    {
        return path.join(...paths);
    }

    read(location: string): Promise<Buffer>
    {
        return fs.readFile(location);
    }
    
    resolve(location: string): string
    {
        return path.resolve(location);
    }

    relative(from: string, to: string): string
    {
        return path.relative(from, to);
    }

    async mimeType(location: string): Promise<string | undefined>
    {
        return mime.lookup(location) || undefined;
    }

    async write(location: string, content: string): Promise<void>
    {
        const directory = path.dirname(location);

        fs.mkdirSync(directory, { recursive: true });

        return fs.writeFile(location, content);
    }
}
