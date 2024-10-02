
import { describe, expect, it } from 'vitest';

import { FileNotFound } from '@jitar/sourcing';

import { LOCAL_REPOSITORIES, FILENAMES, FILES } from './fixtures';

describe('repository/LocalRepository', () =>
{
    describe('.provide(filename)', () =>
    {
        it('should provide a existing file', () =>
        {
            const repository = LOCAL_REPOSITORIES.FILE;

            const promise = repository.provide(FILENAMES.PNG);

            expect(promise).resolves.toEqual(FILES.PNG);
        });

        it('should not provide a non-existing file', () =>
        {
            const repository = LOCAL_REPOSITORIES.FILE;

            const promise = repository.provide(FILENAMES.TXT);

            expect(promise).rejects.toEqual(new FileNotFound(FILENAMES.TXT));
        });

        it('should provide index file when file not found', () =>
        {
            const repository = LOCAL_REPOSITORIES.WEB;

            const promise = repository.provide(FILENAMES.TXT);

            expect(promise).resolves.toEqual(FILES.HTML);
        });
    });
});
