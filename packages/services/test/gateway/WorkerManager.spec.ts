
import { describe, expect, it } from 'vitest';

import { Request, Response, RunModes, StatusCodes, Version, ProcedureNotFound } from '@jitar/execution';

import { WORKER_MANAGERS, REMOTE_WORKERS, VALUES, WORKER_ID } from './fixtures';

import UnknownWorker from '../../src/gateway/errors/UnknownWorker';

const filledManager = WORKER_MANAGERS.FILLED;

describe('gateway/WorkerManager', () =>
{
    describe('.getProcedureNames()', () =>
    {
        it('should get the unique procedure names', () =>
        {
            const procedureNames = filledManager.getProcedureNames();
            expect(procedureNames).toEqual(['first', 'second']);
        });
    });

    describe('.hasProcedure()', () =>
    {
        it('should confirm containing existing procedure names', () =>
        {
            const hasFirst = filledManager.hasProcedure('first');
            expect(hasFirst).toBeTruthy();

            const hasSecond = filledManager.hasProcedure('second');
            expect(hasSecond).toBeTruthy();
        });

        it('should deny containing non-existing procedure names', () =>
        {
            const hasThird = filledManager.hasProcedure('third');
            expect(hasThird).toBeFalsy();
        });
    });

    describe('.addWorker(worker)', () =>
    {
        // The workers are already added in the fixtures
        // thus we only need to test the balancers.
        
        it('should create balancers for added workers', () =>
        {
            const balancers = filledManager.balancers;
            expect(balancers.size).toBe(2);

            const firstBalancer = balancers.get('first');
            expect(firstBalancer).toBeDefined();
            expect(firstBalancer?.workers).toEqual([REMOTE_WORKERS.FIRST, REMOTE_WORKERS.SECOND]);

            const secondBalancer = balancers.get('second');
            expect(secondBalancer).toBeDefined();
            expect(secondBalancer?.workers).toEqual([REMOTE_WORKERS.SECOND]);
        });
    });

    describe('.getWorker(id)', () =>
    {
        it('should get a known worker by id', () =>
        {
            const worker = filledManager.getWorker(WORKER_ID);

            expect(worker).toEqual(REMOTE_WORKERS.FIRST);
        });

        it('should throw an error when worker id is unknown', () =>
        {
            const result = () => filledManager.getWorker(VALUES.UNKNOWN_WORKER_ID);

            expect(result).toThrow(UnknownWorker);
        });
    });

    describe('.run(request)', () =>
    {
        it('should run an existing procedure', async () =>
        {
            const request = new Request('first', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const promise = filledManager.run(request);

            await expect(promise).resolves.toEqual(new Response(StatusCodes.OK, 'test'));
        });

        it('should not run a non-existing procedure', async () =>
        {
            const request = new Request('nonExisting', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const promise = filledManager.run(request);

            await expect(promise).rejects.toEqual(new ProcedureNotFound('nonExisting'));
        });
    });
});
