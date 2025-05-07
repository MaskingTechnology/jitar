
import { NotImplemented } from '@jitar/errors';
import { File, FileNotFound, LocalSourcingManager } from '@jitar/sourcing';

import { FILENAMES } from './filenames.fixture';
import { FILES } from './files.fixtures';

class DummySourcingManager extends LocalSourcingManager
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter(pattern: string): Promise<string[]>
    {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exists(filename: string): Promise<boolean>
    {
        throw new NotImplemented();
    }

    async read(filename: string): Promise<File>
    {
        switch (filename)
        {
            case FILENAMES.HTML: return FILES.HTML;
            case FILENAMES.PNG: return FILES.PNG;
            default: throw new FileNotFound(filename);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(filename: string): Promise<void>
    {
        throw new NotImplemented();
    }
}

export const sourcingManager = new DummySourcingManager('');
