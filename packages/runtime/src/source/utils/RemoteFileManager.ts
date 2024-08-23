
import { NotImplemented } from '../../errors';

import FileManager from '../interfaces/FileManager';
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
        throw new NotImplemented();
    }

    getType(filename: string): Promise<string>
    {
        throw new NotImplemented();
    }

    getContent(filename: string): Promise<Buffer | string>
    {
        throw new NotImplemented();
    }

    read(filename: string): Promise<File>
    {
        throw new NotImplemented();
    }

    write(filename: string, content: string): Promise<void>
    {
        throw new NotImplemented();
    }

    delete(filename: string): Promise<void>
    {
        throw new NotImplemented();
    }

    filter(pattern: string): Promise<string[]>
    {
        throw new NotImplemented();
    }
}
