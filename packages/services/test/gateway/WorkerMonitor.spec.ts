
import { describe, expect, it } from 'vitest';

import { WORKER_MONITORS, REMOTE_WORKERS } from './fixtures';

const monitor = WORKER_MONITORS.EMPTY;

describe('gateway/WorkerMonitor', () =>
{
    it('should remove unhealthy workers', async () =>
    {
        const manager = monitor.workerManager;
        manager.addWorker(REMOTE_WORKERS.HEALTHY);
        manager.addWorker(REMOTE_WORKERS.UNHEALTHY);

        const beforeWorkers = manager.workers;
        expect(beforeWorkers.length).toBe(2);
        expect(beforeWorkers[0]).toBe(REMOTE_WORKERS.HEALTHY);
        expect(beforeWorkers[1]).toBe(REMOTE_WORKERS.UNHEALTHY);

        monitor.start();
        await new Promise(resolve => setTimeout(resolve, 300));
        monitor.stop();

        const afterWorkers = manager.workers;
        expect(afterWorkers.length).toBe(1);
        expect(afterWorkers[0]).toBe(REMOTE_WORKERS.HEALTHY);
    });
});
