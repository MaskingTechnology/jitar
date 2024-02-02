
import WorkerMonitor from '../../../src/services/WorkerMonitor';

import { WORKERS } from './LocalWorker.fixture';
import { GATEWAYS } from './LocalGateway.fixture';

const GATEWAY = GATEWAYS.HEALTH;

const MONITORS =
{
    HEALTH: new WorkerMonitor(GATEWAY, 100)
};

export { MONITORS, GATEWAY, WORKERS };
