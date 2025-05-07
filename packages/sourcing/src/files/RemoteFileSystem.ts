
import RemoteFilesNotSupported from './errors/RemoteFilesNotSupported';
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
        throw new RemoteFilesNotSupported();
    }

    delete(location: string): Promise<void>
    {
        throw new RemoteFilesNotSupported();
    }

    exists(location: string): Promise<boolean>
    {
        throw new RemoteFilesNotSupported();
    }

    async filter(location: string, pattern: string): Promise<string[]>
    {
        return [];
    }

    isDirectory(location: string): boolean
    {
        throw new RemoteFilesNotSupported();
    }

    join(...paths: string[]): string
    {
        throw new RemoteFilesNotSupported();
    }

    read(location: string): Promise<Buffer>
    {
        throw new RemoteFilesNotSupported();
    }

    resolve(location: string): string
    {
        return location;
    }

    relative(from: string, to: string): string
    {
        throw new RemoteFilesNotSupported();
    }

    mimeType(location: string): Promise<string | undefined>
    {
        throw new RemoteFilesNotSupported();
    }

    write(location: string, content: string): Promise<void>
    {
        throw new RemoteFilesNotSupported();
    }
}
