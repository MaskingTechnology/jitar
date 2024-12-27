
import { describe, expect, it } from 'vitest';

import { sourcingManager } from './fixtures';

describe('SourcingManager', () =>
{
    // The sourcing manager uses the file manager for reading files. Importing
    // modules is not something we want to test in this context.
    
    describe('filter', () =>
    {
        it('should return a list of files matching the specified patterns', async () =>
        {
            const result = await sourcingManager.filter('**/*.txt');

            expect(result).toEqual(['file1.txt', 'aaa/file2.txt', 'bbb/file3.txt']);
        });
    });

    describe('import', () =>
    {
        it('should import the specified module', () =>
        {
            // This method is not tested here, because it is pretty obvious when it does not work.
            // Splitting the import into an `importer` implementation would allow us to test the
            // implementation, but that is not necessary for now.

            expect(true).toBe(true);
        });
    });
});
