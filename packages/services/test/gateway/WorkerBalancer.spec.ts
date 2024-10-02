
import { describe, expect, it } from 'vitest';

import { Request, RunModes, Version } from '@jitar/execution';

import NoWorkerAvailable from '../../src/gateway/errors/NoWorkerAvailable';

import { WORKER_BALANCERS, REMOTE_WORKERS } from './fixtures';

describe('services/WorkerBalancer', () =>
{
    describe('.getNextWorker()', () =>
    {
        it('should select workers round robin', async () =>
        {
            const balancer = WORKER_BALANCERS.FILLED;

            const firstSelectedWorker = balancer.getNextWorker();
            const secondSelectedWorker = balancer.getNextWorker();
            const thirdSelectedWorker = balancer.getNextWorker();
            const fourthSelectedWorker = balancer.getNextWorker();

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
            const balancer = WORKER_BALANCERS.EMPTY;

            const request = new Request('nonExisting', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);
            const promise = balancer.run(request);

            expect(promise).rejects.toEqual(new NoWorkerAvailable('nonExisting'));
        });
    });
});
