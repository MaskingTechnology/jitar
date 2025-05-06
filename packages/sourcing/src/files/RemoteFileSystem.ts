
import FileSystem from './interfaces/FileSystem';

/* eslint-disable @typescript-eslint/no-unused-vars */
export default class RemoteFileSystem implements FileSystem
{
    // This is a placeholder class for remote file systems.
    // Its current role is basically saying no to all requests.

    // If we ever want to allow a remote file system, we need to
    // implement an interface for multi-protocol implementations.

    copy(source: string, destination: string): Promise<void>
    {
        throw new Error('Method  1 not implemented.');
    }

    delete(location: string): Promise<void>
    {
        throw new Error('Method  2 not implemented.');
    }

    exists(location: string): Promise<boolean>
    {
        throw new Error('Method 3 not implemented.');
    }

    async filter(location: string, pattern: string): Promise<string[]>
    {
        return [];
    }

    isDirectory(location: string): boolean
    {
        throw new Error('Method 5 not implemented.');
    }

    join(...paths: string[]): string
    {
        throw new Error('Method 6 not implemented.');
    }

    read(location: string): Promise<Buffer>
    {
        throw new Error('Method 7 not implemented.');
    }

    resolve(location: string): string
    {
        return location;
    }

    relative(from: string, to: string): string
    {
        throw new Error('Method 9 not implemented.');
    }

    mimeType(location: string): Promise<string | undefined>
    {
        throw new Error('Method 10 not implemented.');
    }

    write(location: string, content: string): Promise<void>
    {
        throw new Error('Method 11 not implemented.');
    }
}
