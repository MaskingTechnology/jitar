
import { describe, expect, it } from 'vitest';

import { API_URL, node } from '../_fixtures/services/RemoteNode.fixture';

describe('services/LocalGateway', () =>
{
    describe('.url', () =>
    {
        it('should contain an url', () =>
        {
            expect(node.url).toContain(API_URL);
        });
    });

    describe('.getProcedureNames()', () =>
    {
        it('should contain all registered procedure', () =>
        {
            const names = node.getProcedureNames();

            expect(names).toContain('FirstProcedure');
            expect(names).toContain('SecondProcedure');
        });
    });

    describe('.hasProcedure(name)', () =>
    {
        it('should find a procedure', () =>
        {
            const hasFirstProcedure = node.hasProcedure('FirstProcedure');
            const hasSecondProcedure = node.hasProcedure('FirstProcedure');

            expect(hasFirstProcedure).toBeTruthy();
            expect(hasSecondProcedure).toBeTruthy();
        });

        it('should not find a procedure', () =>
        {
            const hasNoProcedure = node.hasProcedure('NoProcedure');

            expect(hasNoProcedure).toBeFalsy();
        });
    });
});
