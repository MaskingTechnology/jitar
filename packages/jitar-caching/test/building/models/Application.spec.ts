
import { describe, expect, it } from 'vitest';

import Application from '../../../src/building/models/Application';

import
{
    segments, modules,
    existingFilename, nonExistingFilename
} from '../../_fixtures/building/models/Application.fixture';

const application = new Application(segments, modules);

describe('building/models/Application', () =>
{
    describe('.getSegmentModule(filename)', () =>
    {
        it('should get an existing segment module', () =>
        {
            const result = application.getSegmentModule(existingFilename);

            expect(result).toBeDefined();
        });

        it('should not get an non-existing segment module', () =>
        {
            const result = application.getSegmentModule(nonExistingFilename);

            expect(result).toBeUndefined();
        });
    });
});
