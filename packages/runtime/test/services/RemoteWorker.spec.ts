
import { describe, expect, it } from 'vitest';

import { WORKERS, WORKER_URL } from '../_fixtures/services/RemoteWorker.fixture';

const worker = WORKERS.REMOTE;

describe('services/RemoteWorker', () =>
{
    describe('.url', () =>
    {
        it('should contain an url', () =>
        {
            expect(worker.url).toContain(WORKER_URL);
        });
    });

    describe('.getProcedureNames()', () =>
    {
        it('should contain all registered procedure', () =>
        {
            const names = worker.getProcedureNames();

            expect(names).toContain('first');
            expect(names).toContain('second');
        });
    });

    describe('.hasProcedure(name)', () =>
    {
        it('should find a procedure', () =>
        {
            const hasFirstProcedure = worker.hasProcedure('first');
            const hasSecondProcedure = worker.hasProcedure('second');

            expect(hasFirstProcedure).toBeTruthy();
            expect(hasSecondProcedure).toBeTruthy();
        });

        it('should not find a procedure', () =>
        {
            const hasNoProcedure = worker.hasProcedure('third');

            expect(hasNoProcedure).toBeFalsy();
        });
    });
});
