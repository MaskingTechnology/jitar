
import LocalWorker from '../../../src/services/LocalWorker';
import WorkerBalancer from '../../../src/services/WorkerBalancer';

import { REPOSITORIES } from './LocalRepository.fixture';

const WORKERS =
{
    FIRST: new LocalWorker(REPOSITORIES.DUMMY),
    SECOND: new LocalWorker(REPOSITORIES.DUMMY)
};

const filledBalancer = new WorkerBalancer();
filledBalancer.addWorker(WORKERS.FIRST);
filledBalancer.addWorker(WORKERS.SECOND);

const BALANCERS =
{
    FILLED: filledBalancer,
    EMPTY: new WorkerBalancer()
};

export { BALANCERS, WORKERS };
