
import { File, FileManager, FileNotFound, SourcingManager } from '@jitar/sourcing';

import { FILENAMES } from './filenames.fixture';
import { FILES } from './files.fixtures';

class DummyFileManager implements FileManager
{
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getType(filename: string): Promise<string>
    {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getContent(filename: string): Promise<Buffer | string>
    {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exists(filename: string): Promise<boolean>
    {
        throw new Error('Method not implemented.');
    }

    async read(filename: string): Promise<File>
    {
        switch (filename)
        {
            case FILENAMES.HTML: return FILES.HTML
            case FILENAMES.PNG: return FILES.PNG
            default: throw new FileNotFound(filename);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    write(filename: string, content: string): Promise<void>
    {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(filename: string): Promise<void>
    {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter(pattern: string): Promise<string[]>
    {
        throw new Error('Method not implemented.');
    }
}

const fileManager = new DummyFileManager();

export const sourcingManager = new SourcingManager(fileManager);
