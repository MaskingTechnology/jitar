
import { describe, expect, it } from 'vitest';

import { APPLICATIONS } from './fixtures';

const application = APPLICATIONS.GENERAL;

describe('models/Application', () =>
{
    // TODO: Add classes tests

    describe('.getProcedureNames()', () =>
    {
        it('should contain all public and protected procedure names', () =>
        {
            const procedureNames = application.getProcedureNames();

            expect(procedureNames).toHaveLength(2);
            expect(procedureNames).toContain('protected');
            expect(procedureNames).toContain('public');
        });
    });

    describe('.hasProcedure(name)', () =>
    {
        it('should have public procedures', () =>
        {
            const hasProtectedProcedure = application.hasProcedure('protected');
            const hasPublicProcedure = application.hasProcedure('public');

            expect(hasProtectedProcedure).toBeTruthy();
            expect(hasPublicProcedure).toBeTruthy();
        });
    });
});
