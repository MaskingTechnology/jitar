
import { describe, expect, it } from 'vitest';

import ApplicationCacheWriter from '../../src/building/ApplicationCacheWriter';

import { TestFileManager } from '../_fixtures/TestFileManager.fixture';
import { INPUT } from '../_fixtures/building/ApplicationCacheWriter.fixture';

describe('building/ApplicationCacheWriter', () =>
{
    describe('.write(cache)', () =>
    {
        it('should write application cache files', async () =>
        {
            // We need to create a new file manager for each test, because the file manager
            // keeps track of the files that are written to disk.

            const fileManager = new TestFileManager();
            const applicationCacheWriter = new ApplicationCacheWriter(fileManager);

            await applicationCacheWriter.write(INPUT);

            const result = fileManager.writtenFiles;
            expect(result.size).toBe(20);
        });
    });
});
