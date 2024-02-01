
import { describe, expect, it } from 'vitest';

import { MONITORS, GATEWAY, WORKERS } from '../_fixtures/services/WorkerMonitor.fixture';

const monitor = MONITORS.HEALTH;

describe('services/WorkerMonitor', () =>
{
    describe('.monitor()', () =>
    {
        it('should keep a worker and remove a worker', async () =>
        {
            const beforeWorkers = GATEWAY.workers;

            expect(beforeWorkers.length).toBe(2);
            expect(beforeWorkers[0]).toBe(WORKERS.GOOD);
            expect(beforeWorkers[1]).toBe(WORKERS.BAD);

            monitor.start();
            await new Promise(resolve => setTimeout(resolve, 300));
            monitor.stop();

            const afterWorkers = GATEWAY.workers;

            expect(afterWorkers.length).toBe(1);
            expect(afterWorkers[0]).toBe(WORKERS.GOOD);
        });
    });
});
