
import LocalWorker from '../../../src/services/LocalWorker';
import { setRuntime } from '../../../src/hooks';

import { HEALTH_CHECKS } from '../interfaces/HealthCheck.fixture';
import { SEGMENTS } from '../models/Segment.fixture';
import { REPOSITORIES } from './LocalRepository.fixture';

const TRUST_KEY = 'MY_TRUST_KEY';

const singleWorker = new LocalWorker(REPOSITORIES.DUMMY, undefined, undefined, TRUST_KEY);
singleWorker.addSegment(SEGMENTS.GENERAL);
singleWorker.addSegment(SEGMENTS.FIRST);
singleWorker.addSegment(SEGMENTS.SECOND);

const firstWorker = new LocalWorker(REPOSITORIES.DUMMY);
firstWorker.addSegment(SEGMENTS.FIRST);

const secondWorker = new LocalWorker(REPOSITORIES.DUMMY);
secondWorker.addSegment(SEGMENTS.SECOND);

const goodWorker = new LocalWorker(REPOSITORIES.DUMMY);
goodWorker.addHealthCheck(HEALTH_CHECKS.GOOD);

const badWorker = new LocalWorker(REPOSITORIES.DUMMY);
badWorker.addHealthCheck(HEALTH_CHECKS.BAD);

const WORKERS =
{
    SINGLE: singleWorker,
    FIRST: firstWorker,
    SECOND: secondWorker,
    GOOD: goodWorker,
    BAD: badWorker
};

setRuntime(singleWorker);

export { WORKERS, TRUST_KEY };
