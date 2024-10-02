
import { describe, expect, it } from 'vitest';

import { Request, Response, RunModes, StatusCodes, Version, ProcedureNotFound } from '@jitar/execution';

import { WORKER_MANAGERS, REMOTE_WORKERS } from './fixtures';

describe('gateway/WorkerManager', () =>
{
    describe('.getProcedureNames()', () =>
    {
        it('should get the unique procedure names', () =>
        {
            const manager = WORKER_MANAGERS.FILLED;

            const procedureNames = manager.getProcedureNames();
            expect(procedureNames).toEqual(['first', 'second']);
        });
    });

    describe('.hasProcedure()', () =>
    {
        it('should confirm containing existing procedure names', () =>
        {
            const manager = WORKER_MANAGERS.FILLED;

            const hasFirst = manager.hasProcedure('first');
            expect(hasFirst).toBeTruthy();

            const hasSecond = manager.hasProcedure('second');
            expect(hasSecond).toBeTruthy();
        });

        it('should deny containing non-existing procedure names', () =>
        {
            const manager = WORKER_MANAGERS.FILLED;

            const hasThird = manager.hasProcedure('third');
            expect(hasThird).toBeFalsy();
        });
    });

    describe('.addWorker(worker)', () =>
    {
        // The workers are already added in the fixtures
        // thus we only need to test the balancers.
        
        it('should create balancers for added workers', () =>
        {
            const manager = WORKER_MANAGERS.FILLED;

            const balancers = manager.balancers;
            expect(balancers.size).toBe(2);

            const firstBalancer = balancers.get('first');
            expect(firstBalancer).toBeDefined();
            expect(firstBalancer?.workers).toEqual([REMOTE_WORKERS.FIRST, REMOTE_WORKERS.SECOND]);

            const secondBalancer = balancers.get('second');
            expect(secondBalancer).toBeDefined();
            expect(secondBalancer?.workers).toEqual([REMOTE_WORKERS.SECOND]);
        });
    });

    describe('.run(request)', () =>
    {
        it('should run an existing procedure', () =>
        {
            const manager = WORKER_MANAGERS.FILLED;
            const request = new Request('first', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const promise = manager.run(request);

            expect(promise).resolves.toEqual(new Response(StatusCodes.OK, 'test'));
        });

        it('should not run a non-existing procedure', () =>
        {
            const manager = WORKER_MANAGERS.FILLED;
            const request = new Request('nonExisting', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const promise = manager.run(request);

            expect(promise).rejects.toEqual(new ProcedureNotFound('nonExisting'));
        });
    });
});
