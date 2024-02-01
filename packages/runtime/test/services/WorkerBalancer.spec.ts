
import { describe, expect, it } from 'vitest';

import NoWorkerAvailable from '../../src/errors/NoWorkerAvailable';
import Request from '../../src/models/Request';
import Version from '../../src/models/Version';

import { BALANCERS, WORKERS } from '../_fixtures/services/WorkerBalancer.fixture';

const balancer = BALANCERS.FILLED;
const emptyBalancer = BALANCERS.EMPTY;

describe('services/WorkerBalancer', () =>
{
    describe('.getNextWorker()', () =>
    {
        it('should select workers round robin', async () =>
        {
            const firstSelectedWorker = balancer.getNextWorker();
            const secondSelectedWorker = balancer.getNextWorker();
            const thirdSelectedWorker = balancer.getNextWorker();
            const fourthSelectedWorker = balancer.getNextWorker();

            expect(firstSelectedWorker).toBe(WORKERS.FIRST);
            expect(secondSelectedWorker).toBe(WORKERS.SECOND);
            expect(thirdSelectedWorker).toBe(WORKERS.FIRST);
            expect(fourthSelectedWorker).toBe(WORKERS.SECOND);
        });
    });

    describe('.run(name, version, parameters)', () =>
    {
        it('should throw a worker not available error', async () =>
        {
            const request = new Request('nonExisting', Version.DEFAULT, new Map(), new Map());
            const run = async () => emptyBalancer.run(request);

            expect(run).rejects.toEqual(new NoWorkerAvailable('nonExisting'));
        });
    });
});
