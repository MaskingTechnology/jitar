
import WorkerManager from '../../../src/gateway/WorkerManager';

import { REMOTE_WORKERS } from './remoteWorkers.fixture';
import { scheduleManager } from './scheduleManager.fixture';

const emptyManager = new WorkerManager(scheduleManager);

const filledManager = new WorkerManager(scheduleManager);
const WORKER_ID = filledManager.addWorker(REMOTE_WORKERS.FIRST);
filledManager.addWorker(REMOTE_WORKERS.SECOND);

const WORKER_MANAGERS =
{
    EMPTY: emptyManager,
    FILLED: filledManager
};

export { WORKER_MANAGERS, WORKER_ID };
