
import LocalGateway from '../../../src/gateway/LocalGateway';

import { healthManager } from './healthManager.fixture';
import { VALUES } from './values.fixture';

const url = VALUES.URL;
const trustKey = VALUES.VALID_TRUST_KEY;

const publicGateway = new LocalGateway({ url, healthManager });
const protectedGateway = new LocalGateway({ url, trustKey, healthManager });

export const LOCAL_GATEWAYS =
{
    PUBLIC: publicGateway,
    PROTECTED: protectedGateway
};
