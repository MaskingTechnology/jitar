
import { describe, expect, it } from 'vitest';

import ApplicationReader from '../../src/building/ApplicationReader';

import { TestFileManager } from '../_fixtures/TestFileManager.fixture';
import { INPUT, OUTPUT } from '../_fixtures/building/ApplicationReader.fixture';

const fileManager = new TestFileManager();
const applicationReader = new ApplicationReader(fileManager);

describe('building/ApplicationReader', () =>
{
    describe('.read(segmentFiles, moduleFiles)', () =>
    {
        it('should read an application from its sources', async () =>
        {
            const result = await applicationReader.read(INPUT.SEGMENT_FILENAMES, INPUT.MODULE_FILENAMES);
            expect(result.segments).toHaveLength(OUTPUT.segments.length);
            expect(result.modules).toHaveLength(OUTPUT.modules.length);

            const firstSegmentResult = result.segments[0];
            const firstSegmentOutput = OUTPUT.segments[0];
            expect(firstSegmentResult.name).toEqual(firstSegmentOutput.name);

            const firstModuleResult = result.modules[0];
            const firstModuleOutput = OUTPUT.modules[0];
            expect(firstModuleResult.filename).toEqual(firstModuleOutput.filename);
        });
    });
});
