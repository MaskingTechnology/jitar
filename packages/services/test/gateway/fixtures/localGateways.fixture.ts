
import LocalGateway from '../../../src/gateway/LocalGateway';

import { VALUES } from './values.fixture';

const url = VALUES.URL;
const trustKey = VALUES.TRUST_KEY;

const publicGateway = new LocalGateway({ url });
const protectedGateway = new LocalGateway({ url, trustKey});

export const LOCAL_GATEWAYS =
{
    PUBLIC: publicGateway,
    PROTECTED: protectedGateway
};
