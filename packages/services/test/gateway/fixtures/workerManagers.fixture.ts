
import WorkerManager from '../../../src/gateway/WorkerManager';

import { REMOTE_WORKERS } from './remoteWorkers.fixture';

const filledManager = new WorkerManager();
filledManager.addWorker(REMOTE_WORKERS.FIRST);
filledManager.addWorker(REMOTE_WORKERS.SECOND);

export const WORKER_MANAGERS =
{
    FILLED: filledManager
};
