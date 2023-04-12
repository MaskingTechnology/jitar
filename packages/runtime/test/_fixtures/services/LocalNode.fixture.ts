
import LocalNode from '../../../src/services/LocalNode';
import { setRuntime } from '../../../src/hooks/runtime';

import { HEALTH_CHECKS } from '../interfaces/HealthCheck.fixture';
import { SEGMENTS } from '../models/Segment.fixture';

const singleNode = new LocalNode();
singleNode.addSegment(SEGMENTS.GENERAL);
singleNode.addSegment(SEGMENTS.FIRST);
singleNode.addSegment(SEGMENTS.SECOND);

const firstNode = new LocalNode();
firstNode.addSegment(SEGMENTS.FIRST);

const secondNode = new LocalNode();
secondNode.addSegment(SEGMENTS.SECOND);

const goodNode = new LocalNode();
goodNode.addHealthCheck('good', HEALTH_CHECKS.GOOD);

const badNode = new LocalNode();
badNode.addHealthCheck('bad', HEALTH_CHECKS.BAD);

const NODES =
{
    SINGLE: singleNode,
    FIRST: firstNode,
    SECOND: secondNode,
    GOOD: goodNode,
    BAD: badNode
}

setRuntime(singleNode);

export { NODES }
