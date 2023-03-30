
import NodeMonitor from '../../../src/services/NodeMonitor';

import { NODES } from './LocalNode.fixture';
import { GATEWAYS } from './LocalGateway.fixture';

const GATEWAY = GATEWAYS.HEALTH;

const MONITORS =
{
    HEALTH: new NodeMonitor(GATEWAY, 100)
}

export { MONITORS, GATEWAY, NODES }
