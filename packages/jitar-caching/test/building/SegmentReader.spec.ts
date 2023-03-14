
import { describe, expect, it } from 'vitest';

import SegmentReader from '../../src/building/SegmentReader';

import { TestFileManager } from '../_fixtures/TestFileManager.fixture';
import { INPUT, OUTPUT } from '../_fixtures/building/SegmentReader.fixture';

const fileManager = new TestFileManager();
const segmentReader = new SegmentReader(fileManager);

describe('building/SegmentReader', () =>
{
    describe('.read(filename)', () =>
    {
        it('should read a segment from a definition file', async () =>
        {
            const result = await segmentReader.read(INPUT);

            expect(result).toEqual(OUTPUT);
        });
    });
});
