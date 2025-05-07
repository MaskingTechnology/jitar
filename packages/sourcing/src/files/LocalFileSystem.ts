
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

    // This method is synchronous because it's used in the
    // LocationRewriter. This class uses a replacer function
    // in a replaceAll method that only accepts synchronous functions.
    
    // This is a limitation of the current implementation and must be
    // addressed in the future.
    isDirectory(location: string): boolean
    {
        try
        {
            const stats = fs.statSync(location);

            return stats.isDirectory();
        }
        catch
        {
            // We might reference a locations that doesn't exist
            // because it's a file without an extension and that 
            // is not a reason to throw an error.

            return false;
        }
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
        const mimeType = mime.lookup(location);

        if (mimeType === false)
        {
            return undefined;
        }

        return mimeType;
    }

    async write(location: string, content: string): Promise<void>
    {
        const directory = path.dirname(location);

        fs.mkdirSync(directory, { recursive: true });

        return fs.writeFile(location, content);
    }
}
