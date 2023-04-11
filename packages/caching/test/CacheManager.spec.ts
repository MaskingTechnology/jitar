
import { describe, expect, it } from 'vitest';

import CacheManager from '../src/CacheManager';

import { TestFileManager } from './_fixtures/TestFileManager.fixture';

describe('CacheManager', () =>
{
    describe('.build()', () =>
    {
        it('should write a segment from a definition file', async () =>
        {
            // We need to create a new file manager for each test, because the file manager
            // keeps track of the files that are written to disk.

            const fileManager = new TestFileManager();
            const cacheManager = new CacheManager(fileManager, fileManager);

            await cacheManager.build();

            const result = fileManager.writtenFiles;
            expect(result.size).toBe(20);
        });
    });
});
