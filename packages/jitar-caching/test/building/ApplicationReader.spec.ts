
import { describe, expect, it } from 'vitest';

import ApplicationReader from '../../src/building/ApplicationReader';

import { TestFileManager } from '../_fixtures/TestFileManager.fixture';
import { INPUT, OUTPUT } from '../_fixtures/building/ApplicationReader.fixture';

const fileManager = new TestFileManager();
const applicationReader = new ApplicationReader(fileManager);

describe('building/ApplicationReader', () =>
{
    describe('.read(filename)', () =>
    {
        it('should read an application from its source', async () =>
        {
            const result = await applicationReader.read(INPUT.SEGMENT_FILENAMES, INPUT.MODULE_FILENAMES);

            expect(result).toEqual(OUTPUT);
        });
    });
});
