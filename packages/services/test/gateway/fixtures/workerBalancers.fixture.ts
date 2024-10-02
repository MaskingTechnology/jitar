
import WorkerBalancer from '../../../src/gateway/WorkerBalancer';

import { REMOTE_WORKERS } from './remoteWorkers.fixture';

const emptyBalancer = new WorkerBalancer();

const filledBalancer = new WorkerBalancer();
filledBalancer.addWorker(REMOTE_WORKERS.FIRST);
filledBalancer.addWorker(REMOTE_WORKERS.SECOND);

export const WORKER_BALANCERS =
{
    EMPTY: emptyBalancer,
    FILLED: filledBalancer
};
