
import { describe, expect, it } from 'vitest';

import { segment } from '../_fixtures/models/Segment.fixture';

describe('models/Segment', () =>
{
    describe('.hasProcedure', () =>
    {
        it('should have a public procedure', async () =>
        {
            const hasProcedure = segment.hasProcedure('getPublic');

            expect(hasProcedure).toBeTruthy();
        });

        it('should have a private procedure', async () =>
        {
            const hasProcedure = segment.hasProcedure('getPrivate');

            expect(hasProcedure).toBeTruthy();
        });

        it('should have modulerized procedures', async () =>
        {
            const hasProcedure = segment.hasProcedure('my/module/getModule');

            expect(hasProcedure).toBeTruthy();
        });
    });

    describe('.getPublicProcedures()', () =>
    {
        it('should return public procedures only', async () =>
        {
            const procedures = segment.getPublicProcedures();

            expect(procedures.length).toBe(1);
            expect(procedures[0].fqn).toBe('getPublic');
        });
    });
});
