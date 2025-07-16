
import LocalGateway from '../../../src/gateway/LocalGateway';

import { healthManager } from './healthManager.fixture';
import { WORKER_MANAGERS } from './workerManagers.fixture';
import { VALUES } from './values.fixture';

const url = VALUES.URL;
const trustKey = VALUES.VALID_TRUST_KEY;
const workerManager = WORKER_MANAGERS.EMPTY;

const publicGateway = new LocalGateway({ url, healthManager, workerManager });
const protectedGateway = new LocalGateway({ url, trustKey, healthManager, workerManager });

export const LOCAL_GATEWAYS =
{
    PUBLIC: publicGateway,
    PROTECTED: protectedGateway
};
