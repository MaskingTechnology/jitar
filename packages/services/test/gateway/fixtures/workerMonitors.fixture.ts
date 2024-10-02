
import WorkerManager from '../../../src/gateway/WorkerManager';
import WorkerMonitor from '../../../src/gateway/WorkerMonitor';

const emptyManager = new WorkerManager();
const emptyMonitor = new WorkerMonitor(emptyManager, 200);

export const WORKER_MONITORS =
{
    EMPTY: emptyMonitor
};
