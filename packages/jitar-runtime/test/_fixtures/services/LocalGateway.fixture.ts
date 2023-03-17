
import LocalNode from '../../../src/services/LocalNode';
import LocalGateway from '../../../src/services/LocalGateway';

import { setRuntime } from '../../../src/hooks';

import { firstSegment, secondSegment } from './segments';

const API_URL = 'http://localhost:80';

const gateway = new LocalGateway(API_URL);

const firstNode = new LocalNode();
firstNode.addSegment(firstSegment);
firstNode.setGateway(gateway);

const secondNode = new LocalNode();
secondNode.addSegment(secondSegment);
secondNode.setGateway(gateway);

// All test cases have to start from this node
setRuntime(firstNode);

export { API_URL, gateway }
