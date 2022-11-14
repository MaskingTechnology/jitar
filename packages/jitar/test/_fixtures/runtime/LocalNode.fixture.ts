
import LocalNode from '../../../src/runtime/LocalNode';

import { setRuntime } from '../../../src/hooks';

import { firstSegment, secondSegment } from './segments';

const API_URL = 'http://localhost:80';

const node = new LocalNode(API_URL);
node.addSegment(firstSegment);
node.addSegment(secondSegment);

setRuntime(node);

export { API_URL, node }
