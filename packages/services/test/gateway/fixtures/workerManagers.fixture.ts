
import WorkerManager from '../../../src/gateway/WorkerManager';

import { REMOTE_WORKERS } from './remoteWorkers.fixture';

const filledManager = new WorkerManager();
const WORKER_ID = filledManager.addWorker(REMOTE_WORKERS.FIRST);
filledManager.addWorker(REMOTE_WORKERS.SECOND);

const WORKER_MANAGERS =
{
    FILLED: filledManager
};

export { WORKER_MANAGERS, WORKER_ID }
