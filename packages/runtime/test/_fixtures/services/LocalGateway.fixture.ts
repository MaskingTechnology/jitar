
import LocalGateway from '../../../src/services/LocalGateway';

import { NODES } from './LocalNode.fixture';

const GATEWAY_URL = 'http://localhost:80';

const standaloneGateway = new LocalGateway(GATEWAY_URL);
standaloneGateway.addNode(NODES.SINGLE);

const distributedGateway = new LocalGateway(GATEWAY_URL);
distributedGateway.addNode(NODES.FIRST);
distributedGateway.addNode(NODES.SECOND);

const healthGateway = new LocalGateway(GATEWAY_URL);
healthGateway.addNode(NODES.GOOD);
healthGateway.addNode(NODES.BAD);

const GATEWAYS =
{
    STANDALONE: standaloneGateway,
    DISTRIBUTED: distributedGateway,
    HEALTH: healthGateway
};

export { GATEWAYS, GATEWAY_URL };
