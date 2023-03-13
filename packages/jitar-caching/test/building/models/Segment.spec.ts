
import { describe, expect, it } from 'vitest';

import Segment from '../../../src/building/models/Segment';

import
{
    modules,
    existingFilename, nonExistingFilename
} from '../../_fixtures/building/models/Segment.fixture';

const segment = new Segment('segment', modules);

describe('building/models/Segment', () =>
{
    describe('.hasModule(filename)', () =>
    {
        it('should have an existing module', () =>
        {
            const result = segment.hasModule(existingFilename);

            expect(result).toBeTruthy();
        });

        it('should not have an non-existing module', () =>
        {
            const result = segment.hasModule(nonExistingFilename);

            expect(result).toBeFalsy();
        });
    });

    describe('.getModule(filename)', () =>
    {
        it('should get an existing module', () =>
        {
            const result = segment.getModule(existingFilename);

            expect(result).toBeDefined();
        });

        it('should not get an non-existing module', () =>
        {
            const result = segment.getModule(nonExistingFilename);

            expect(result).toBeUndefined();
        });
    });
});
