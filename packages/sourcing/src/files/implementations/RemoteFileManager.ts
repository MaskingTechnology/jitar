
import type FileManager from '../interfaces/FileManager';
import File from '../models/File';

export default class RemoteFileManager implements FileManager
{
    #rootUrl: string;

    constructor(rootUrl: string)
    {
        this.#rootUrl = rootUrl;
    }

    getRootLocation(): string
    {
        return this.#rootUrl;
    }

    getAbsoluteLocation(filename: string): string
    {
        return `${this.#rootUrl}/${filename}`;
    }

    getRelativeLocation(filename: string): string
    {
        throw new Error('Not implemented');
    }

    getType(filename: string): Promise<string>
    {
        throw new Error('Not implemented');
    }

    getContent(filename: string): Promise<Buffer | string>
    {
        throw new Error('Not implemented');
    }

    exists(filename: string): Promise<boolean>
    {
        throw new Error('Not implemented');
    }

    read(filename: string): Promise<File>
    {
        throw new Error('Not implemented');
    }

    write(filename: string, content: string): Promise<void>
    {
        throw new Error('Not implemented');
    }

    delete(filename: string): Promise<void>
    {
        throw new Error('Not implemented');
    }

    filter(pattern: string): Promise<string[]>
    {
        throw new Error('Not implemented');
    }
}
