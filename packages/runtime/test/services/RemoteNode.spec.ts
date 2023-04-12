
import { describe, expect, it } from 'vitest';

import { NODES, NODE_URL } from '../_fixtures/services/RemoteNode.fixture';

const node = NODES.REMOTE;

describe('services/LocalGateway', () =>
{
    describe('.url', () =>
    {
        it('should contain an url', () =>
        {
            expect(node.url).toContain(NODE_URL);
        });
    });

    describe('.getProcedureNames()', () =>
    {
        it('should contain all registered procedure', () =>
        {
            const names = node.getProcedureNames();

            expect(names).toContain('first');
            expect(names).toContain('second');
        });
    });

    describe('.hasProcedure(name)', () =>
    {
        it('should find a procedure', () =>
        {
            const hasFirstProcedure = node.hasProcedure('first');
            const hasSecondProcedure = node.hasProcedure('second');

            expect(hasFirstProcedure).toBeTruthy();
            expect(hasSecondProcedure).toBeTruthy();
        });

        it('should not find a procedure', () =>
        {
            const hasNoProcedure = node.hasProcedure('third');

            expect(hasNoProcedure).toBeFalsy();
        });
    });
});
