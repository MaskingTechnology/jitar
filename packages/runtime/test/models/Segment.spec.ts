
import { describe, expect, it } from 'vitest';

import { SEGMENTS } from '../_fixtures/models/Segment.fixture';

const generalSegment = SEGMENTS.GENERAL;

describe('models/Segment', () =>
{
    describe('.hasProcedure', () =>
    {
        it('should have a public procedure', async () =>
        {
            const hasProcedure = generalSegment.hasProcedure('public');

            expect(hasProcedure).toBeTruthy();
        });

        it('should have a private procedure', async () =>
        {
            const hasProcedure = generalSegment.hasProcedure('private');

            expect(hasProcedure).toBeTruthy();
        });
    });

    // protected
    describe('.getExposedProcedures()', () =>
    {
        it('should return public procedures only', async () =>
        {
            const procedures = generalSegment.getExposedProcedures();

            expect(procedures.length).toBe(1);
            expect(procedures[0].fqn).toBe('public');
        });
    });
});
