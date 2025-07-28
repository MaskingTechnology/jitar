
import { describe, expect, it } from 'vitest';

import { FileNotFound } from '@jitar/sourcing';

import { LOCAL_REPOSITORIES, FILENAMES, FILES } from './fixtures';

const fileRepository = LOCAL_REPOSITORIES.FILE;
const webRepository = LOCAL_REPOSITORIES.WEB;

describe('repository/LocalRepository', () =>
{
    describe('.provide(filename)', () =>
    {
        it('should provide a existing file', async () =>
        {
            const promise = fileRepository.provide(FILENAMES.PNG);

            await expect(promise).resolves.toEqual(FILES.PNG);
        });

        it('should not provide a non-existing file', async () =>
        {
            const promise = fileRepository.provide(FILENAMES.TXT);

            await expect(promise).rejects.toEqual(new FileNotFound(FILENAMES.TXT));
        });

        it('should provide index file when file not found', async () =>
        {
            const promise = webRepository.provide(FILENAMES.TXT);

            await expect(promise).resolves.toEqual(FILES.HTML);
        });
    });

    // TODO: Add tests for states
});
