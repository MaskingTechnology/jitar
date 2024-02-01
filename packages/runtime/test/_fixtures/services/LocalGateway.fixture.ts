
import LocalGateway from '../../../src/services/LocalGateway';

import { REPOSITORIES } from './LocalRepository.fixture';
import { WORKERS } from './LocalWorker.fixture';

const GATEWAY_URL = 'http://localhost:80';

const standaloneGateway = new LocalGateway(REPOSITORIES.DUMMY, GATEWAY_URL);
standaloneGateway.addWorker(WORKERS.SINGLE);

const distributedGateway = new LocalGateway(REPOSITORIES.DUMMY, GATEWAY_URL);
distributedGateway.addWorker(WORKERS.FIRST);
distributedGateway.addWorker(WORKERS.SECOND);

const healthGateway = new LocalGateway(REPOSITORIES.DUMMY, GATEWAY_URL);
healthGateway.addWorker(WORKERS.GOOD);
healthGateway.addWorker(WORKERS.BAD);

const protectedGateway = new LocalGateway(REPOSITORIES.DUMMY, GATEWAY_URL, 'MY_PROTECTED_ACCESS_KEY');
protectedGateway.addWorker(WORKERS.FIRST, 'MY_PROTECTED_ACCESS_KEY');
protectedGateway.addWorker(WORKERS.SECOND);

const GATEWAYS =
{
    STANDALONE: standaloneGateway,
    DISTRIBUTED: distributedGateway,
    HEALTH: healthGateway,
    PROTECTED: protectedGateway
};

export { GATEWAYS, GATEWAY_URL };
