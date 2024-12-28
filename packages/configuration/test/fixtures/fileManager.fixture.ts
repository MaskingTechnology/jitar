
import { File, FileManager } from '@jitar/sourcing';

export default class TestFileManager implements FileManager
{
    readonly #files: Record<string, File>;

    constructor(files: Record<string, File>)
    {
        this.#files = files;
    }

    getRootLocation(): string
    {
        throw new Error('Method not implemented.');
    }

    getAbsoluteLocation(filename: string): string
    {
        throw new Error('Method not implemented.');
    }

    getRelativeLocation(filename: string): string
    {
        throw new Error('Method not implemented.');
    }

    getType(filename: string): Promise<string>
    {
        throw new Error('Method not implemented.');
    }

    getContent(filename: string): Promise<Buffer | string>
    {
        throw new Error('Method not implemented.');
    }

    exists(filename: string): Promise<boolean>
    {
        for (const key in this.#files)
        {
            const value = this.#files[key];

            if (value.location === filename)
            {
                return Promise.resolve(true);
            }
        }

        return Promise.resolve(false);
    }

    read(filename: string): Promise<File>
    {
        let file: File | undefined;

        for (const key in this.#files)
        {
            const value = this.#files[key];

            if (value.location === filename)
            {
                file = value;

                break;
            }
        }

        return Promise.resolve(file as File);
    }
    
    write(filename: string, content: string): Promise<void>
    {
        throw new Error('Method not implemented.');
    }

    delete(filename: string): Promise<void>
    {
        throw new Error('Method not implemented.');
    }

    filter(pattern: string): Promise<string[]>
    {
        throw new Error('Method not implemented.');
    }
}
