
import { describe, expect, it } from 'vitest';

import SegmentCacheWriter from '../../src/building/SegmentCacheWriter';

import { TestFileManager } from '../_fixtures/TestFileManager.fixture';
import { INPUT, OUTPUT } from '../_fixtures/building/SegmentCacheWriter.fixture';

describe('building/SegmentCacheWriter', () =>
{
    describe('.write(cache)', () =>
    {
        it('should write segment cache files', async () =>
        {
            // We need to create a new file manager for each test, because the file manager
            // keeps track of the files that are written to disk.

            const fileManager = new TestFileManager();
            const segmentCacheWriter = new SegmentCacheWriter(fileManager);

            await segmentCacheWriter.write(INPUT.ORDER);
            await segmentCacheWriter.write(INPUT.PRODUCT);

            const result = fileManager.writtenFiles;
            expect(result.size).toBe(4);

            expect(result.get(OUTPUT.FILENAMES.ORDER_NODE)).toBe(OUTPUT.CONTENT.ORDER_NODE);
            expect(result.get(OUTPUT.FILENAMES.ORDER_REPOSITORY)).toBe(OUTPUT.CONTENT.ORDER_REPOSITORY);

            expect(result.get(OUTPUT.FILENAMES.PRODUCT_NODE)).toBe(OUTPUT.CONTENT.PRODUCT_NODE);
            expect(result.get(OUTPUT.FILENAMES.PRODUCT_REPOSITORY)).toBe(OUTPUT.CONTENT.PRODUCT_REPOSITORY);
        });
    });
});
