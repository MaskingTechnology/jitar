
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'glob';
import mime from 'mime-types';

import FileSystem from './interfaces/FileSystem';

export default class LocalFileSystem implements FileSystem
{
    copy(source: string, destination: string): Promise<void>
    {
        return fsp.cp(source, destination, { recursive: true, force: true });
    }

    delete(location: string): Promise<void>
    {
        return fsp.rm(location,  { recursive: true, force: true });
    }

    async exists(location: string): Promise<boolean>
    {
        try
        {
            await fsp.stat(location);
            
            return true;
        }
        catch
        {
            return false;
        }
    }

    isAbsolute(location: string): boolean
    {
        return path.isAbsolute(location); 
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
        return fsp.readFile(location);
    }
    
    resolve(location: string): string
    {
        return path.resolve(location);
    }

    relative(from: string, to: string): string
    {
        return path.relative(from, to);
    }

    normalize(location: string): string
    {
        return location.replaceAll(path.win32.sep, path.posix.sep);
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

        return fsp.writeFile(location, content);
    }
}
