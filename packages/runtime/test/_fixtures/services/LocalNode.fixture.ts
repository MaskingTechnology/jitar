
import LocalNode from '../../../src/services/LocalNode';
import { setRuntime } from '../../../src/hooks';

import { HEALTH_CHECKS } from '../interfaces/HealthCheck.fixture';
import { SEGMENTS } from '../models/Segment.fixture';
import { REPOSITORIES } from './LocalRepository.fixture';

const singleNode = new LocalNode([], REPOSITORIES.DUMMY);
singleNode.addSegment(SEGMENTS.GENERAL);
singleNode.addSegment(SEGMENTS.FIRST);
singleNode.addSegment(SEGMENTS.SECOND);

const firstNode = new LocalNode([], REPOSITORIES.DUMMY);
firstNode.addSegment(SEGMENTS.FIRST);

const secondNode = new LocalNode([], REPOSITORIES.DUMMY);
secondNode.addSegment(SEGMENTS.SECOND);

const goodNode = new LocalNode([], REPOSITORIES.DUMMY);
goodNode.addHealthCheck(HEALTH_CHECKS.GOOD);

const badNode = new LocalNode([], REPOSITORIES.DUMMY);
badNode.addHealthCheck(HEALTH_CHECKS.BAD);

const NODES =
{
    SINGLE: singleNode,
    FIRST: firstNode,
    SECOND: secondNode,
    GOOD: goodNode,
    BAD: badNode
};

setRuntime(singleNode);

export { NODES };
