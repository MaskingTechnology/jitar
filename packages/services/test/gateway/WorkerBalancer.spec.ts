
import { describe, expect, it } from 'vitest';

import { Request, RunModes, Version } from '@jitar/execution';

import NoWorkerAvailable from '../../src/gateway/errors/NoWorkerAvailable';

import { WORKER_BALANCERS, REMOTE_WORKERS } from './fixtures';

const emptyBalancer = WORKER_BALANCERS.EMPTY;
const filledBalancer = WORKER_BALANCERS.FILLED;

describe('services/WorkerBalancer', () =>
{
    describe('.getNextWorker()', () =>
    {
        it('should select workers round robin', async () =>
        {
            const firstSelectedWorker = filledBalancer.getNextWorker();
            const secondSelectedWorker = filledBalancer.getNextWorker();
            const thirdSelectedWorker = filledBalancer.getNextWorker();
            const fourthSelectedWorker = filledBalancer.getNextWorker();

            expect(firstSelectedWorker).toBe(REMOTE_WORKERS.FIRST);
            expect(secondSelectedWorker).toBe(REMOTE_WORKERS.SECOND);
            expect(thirdSelectedWorker).toBe(REMOTE_WORKERS.FIRST);
            expect(fourthSelectedWorker).toBe(REMOTE_WORKERS.SECOND);
        });
    });

    describe('.run(request)', () =>
    {
        it('should throw a worker not available error', async () =>
        {
            const request = new Request('nonExisting', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);
            const promise = emptyBalancer.run(request);

            await expect(promise).rejects.toEqual(new NoWorkerAvailable('nonExisting'));
        });
    });
});
